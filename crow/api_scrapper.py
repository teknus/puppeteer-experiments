from twitter import Twitter, OAuth


def scrapp_this_user(config, screen_name):

    if config is None:
        raise Exception("Please pass the API keys")

    if screen_name is None or screen_name == '':
        raise Exception(
            "Please give the user screen name to get information from"
        )

    twitter = Twitter(
        auth=OAuth(
            config.token,
            config.token_secret,
            config.consumer_key,
            config.consumer_secret
        )
    )

    results = twitter.users.search(q=screen_name)
    user_data = dict()
    for user in results:
        user_data[user['screen_name']] = user
        user_data['tweets'] = twitter.statuses.user_timeline(
            screen_name=user['screen_name']
        )
    return user_data
