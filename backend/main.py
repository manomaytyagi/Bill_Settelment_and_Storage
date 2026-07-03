import os
from dotenv import load_dotenv
import uuid

from supabase import create_client, Client

from fastapi import FastAPI, File, UploadFile, Form


load_dotenv()
app = FastAPI()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

@app.get("/health")
def get_health():
    return { "status" : "ok" }

@app.post("/submit")
def submit_form(proof: UploadFile, bill: UploadFile, project: str = Form(...), vendor: str = Form(...), amount: int = Form(...)):
    proof_bytes = proof.file.read()
    response_proof = (
        supabase.storage
        .from_("bills")
        .upload(
            file=proof_bytes,
            path=f"{uuid.uuid4()}_{proof.filename}",
            file_options={"cache-control": "3600", "upsert": "false"}
        )
    )
    bill_bytes = bill.file.read()
    response_bill = (
        supabase.storage
        .from_("bills")
        .upload(
            file=bill_bytes,
            path=f"{uuid.uuid4()}_{bill.filename}",
            file_options={"cache-control": "3600", "upsert": "false"}
        )
    )