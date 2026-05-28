# Must be imported first in main.py — patches SSL for corporate/TCS environments
import ssl, os, certifi

os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()
os.environ["SSL_CERT_FILE"] = certifi.where()
os.environ["CURL_CA_BUNDLE"] = certifi.where()

try:
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
except ImportError:
    pass

try:
    import httpx
    _orig_init = httpx.Client.__init__
    def _patched_init(self, *a, **kw):
        kw.setdefault("verify", certifi.where())
        _orig_init(self, *a, **kw)
    httpx.Client.__init__ = _patched_init
    httpx.AsyncClient.__init__ = _patched_init
except ImportError:
    pass
