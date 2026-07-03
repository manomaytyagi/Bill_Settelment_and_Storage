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
    proof_path = f"{uuid.uuid4()}_{proof.filename}"
    response_proof = (
        supabase.storage
        .from_("bills")
        .upload(
            file=proof_bytes,
            path=proof_path,
            file_options={"cache-control": "3600", "upsert": "false"}
        )
    )
    
    bill_bytes = bill.file.read()
    bill_path = f"{uuid.uuid4()}_{bill.filename}"
    response_bill = (
        supabase.storage
        .from_("bills")
        .upload(
            file=bill_bytes,
            path=bill_path,
            file_options={"cache-control": "3600", "upsert": "false"}
        )
    )
    proof_url = supabase.storage.from_("bills").get_public_url(proof_path)
    bill_url = supabase.storage.from_("bills").get_public_url(bill_path)
    
    supabase.table("submissions").insert({
        "payment_proof": proof_url,
        "bill": bill_url,
        "project": project,
        "vendor": vendor,
        "amount": amount
    }).execute()