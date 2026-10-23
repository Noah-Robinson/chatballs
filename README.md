# How to add chatballs to your stream:
- Download the files
- In the same folder that the index.html page is in, you must add [comfy.js](https://github.com/instafluff/comfyjs) and [matter.js](https://github.com/liabru/matter-js)
- Open chatterview.js in any text editor and change the CHANNELNAME variable to your channel's name
- Add the index.html file as a browser source in OBS

That's it! You should now see that when a chatter leaves a message, they are added as a ball to the stream and any subsequent messages will make the ball move around

# TODO
- [X] Prevent bots from getting a ball
- [ ] Make messages that tag someone move ball towards theirs if they are in the chat
- [ ] Add a blacklist on users that can appear
- [ ] Add a way to display username over ball
- [ ] Make multiple messages stack above ball instead of overwriting
