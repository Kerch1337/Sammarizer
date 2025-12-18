from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import requests


from db import init_db, Summary, SessionLocal
from summarizer import summarize_pipeline

app = FastAPI()


@app.on_event("startup")
def on_startup():
    init_db()


class SummaryCreate(BaseModel):
    url: str


class SummaryResponse(BaseModel):
    id: int
    url: str
    title: str | None = None
    summary: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


def get_youtube_title(url: str, ) -> str | None:
    try:
        resp = requests.get(
            "https://www.youtube.com/oembed",
            params={"url": url, "format": "json"},
            timeout=5,
        )
        if resp.status_code != 200:
            
            return None
        return resp.json().get("title")
    except Exception:
        return None


def run_summary(summary_id: int, url: str):
    db: Session = SessionLocal()
    try:
        item = db.query(Summary).filter(Summary.id == summary_id).first()
        if not item:
            return

        item.summary = summarize_pipeline(summary_id, url)
        db.commit()
    except Exception as e:
        print("Background error:", e)
        db.rollback()
    finally:
        db.close()


@app.post("/create", response_model=SummaryResponse)
def create_item(item: SummaryCreate, background_tasks: BackgroundTasks):
    db: Session = SessionLocal()
    try:
        title = get_youtube_title(item.url)

        new_item = Summary(url=item.url,title=title, summary=None)
        db.add(new_item)
        db.commit()
        db.refresh(new_item)

        background_tasks.add_task(run_summary, new_item.id, new_item.url)

        return new_item
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@app.get("/items/{item_id}", response_model=SummaryResponse)
def get_item(item_id: int):
    db: Session = SessionLocal()
    try:
        item = db.query(Summary).filter(Summary.id == item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        return item
    finally:
        db.close()


@app.get("/get-all-items", response_model=List[SummaryResponse])
def get_all_items():
    db: Session = SessionLocal()
    try:
        return db.query(Summary).order_by(Summary.id.desc()).all()
    finally:
        db.close()
