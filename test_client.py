from errorlens import post_event, get_events, get_summary


if __name__ == "__main__":
    print("Posting test event...")
    post_response = post_event(
        application="example-app",
        message="This is a test event from the ErrorLens Python SDK.",
        severity="high",
    )
    print("post_event response:", post_response)

    print("Fetching events...")
    events = get_events()
    print("get_events response:", events)

    print("Fetching summary...")
    summary = get_summary()
    print("get_summary response:", summary)
