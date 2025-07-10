from yandex_tracker_client import TrackerClient

client = TrackerClient(
    token='y0_AgAEA7qkDtfXAAxntAAAAAEQXyAHAAAeCbMZsndMaYriBaGKrZ7yIU7G3Q', 
    org_id='7091930'
)


print(client.issues['IIFA-8995'])