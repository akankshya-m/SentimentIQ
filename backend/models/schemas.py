from pydantic import BaseModel
from typing import List

class AnalyseRequest(BaseModel):
    keyword: str
    sources: List[str] = ["tw", "rd", "nw"]
