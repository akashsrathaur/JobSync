import boto3
import uuid
import os
from typing import Optional
from app.core.config import settings

def upload_file_to_s3(file_content: bytes, filename: str) -> Optional[str]:
    """
    Upload a file to AWS S3 and return its public URL.
    Returns None if S3 is not configured or upload fails.
    """
    if not settings.USE_S3 or not settings.S3_BUCKET_NAME:
        return None
        
    try:
        # Initialize the S3 client using boto3
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
        )
        
        # Generate a distinct key for the object
        ext = os.path.splitext(filename)[1]
        s3_key = f"resumes/{uuid.uuid4()}{ext}"
        
        # Upload the file
        s3_client.put_object(
            Bucket=settings.S3_BUCKET_NAME,
            Key=s3_key,
            Body=file_content,
            ContentType="application/pdf" if ext.lower() == ".pdf" else "application/octet-stream",
            # We assume the bucket is configured for public read or we return a public URL
            # ACL='public-read' # uncomment if bucket forces ACLs
        )
        
        # Generate the object URL
        # For an S3 bucket in a standard region:
        url = f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{s3_key}"
        return url
        
    except Exception as e:
        print(f"Failed to upload to S3: {e}")
        return None
