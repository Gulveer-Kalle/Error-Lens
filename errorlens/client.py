import requests

BASE_URL = "http://localhost:5000"


def post_event(
    application,
    message,
    severity,
    environment="production",
    event_type="error",
    source="python-sdk",
):
    url = f"{BASE_URL}/events"
    payload = {
        "application": application,
        "message": message,
        "severity": severity,
        "environment": environment,
        "event_type": event_type,
        "source": source,
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.RequestException:
        print("ErrorLens SDK: Failed to post event")
        return None


def get_events(severity=None, environment=None):
    url = f"{BASE_URL}/events"
    params = {}

    if severity is not None:
        params["severity"] = severity
    if environment is not None:
        params["environment"] = environment

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException:
        return None


def get_summary():
    url = f"{BASE_URL}/events/summary"

    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException:
        return None
