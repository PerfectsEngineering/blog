---
title: Build a typing indicator in Android using Pusher
date: '2017-03-22T22:12:03.284Z'
tags: ["android", "pusher", "realtime", "chat", "tutorial", "java"]
featureImage: ../assets/build_a_typing_indicator_in_android.jpg
followUpPosts: ["build_a_typing_indcator_with_rxjs"]
---

In this tutorial, we are going to build a typing indicator in an Android chat application using Pusher. A basic knowledge of how to build Android applications is assumed in this tutorial and we'll be focusing on the implementation of the typing indicator of the Android application.

## Overview of the chat app

The chat application will be simple. First, we will build a simple Node.js server that will receive requests from Android when a user is typing. The server will then broadcast this to everyone as a Pusher event.

Then we will go ahead to build the Android application. When a user starts typing in the edit text field of the Android app, the app sends a request to the server. The Android app will also subscribe to the typing events from Pusher and show a 'user is typing' message when a broadcast is received.

## Setup a Pusher account
We will be using Pusher for the realtime features of this chat application, so the first step is to create your Pusher account. You can do this at https://pusher.com/signup. When you first log in, a pop-up dialogue appears as shown below:

![](https://images.contentful.com/1es3ne0caaid/3c28uKB8ZWM0cwOEOqao2S/10800fa593ff7fa8ba772b01354327ab/typing-indicator-android-create-app.png)

If you already have an account, log in to the Pusher dashboard and click on the Create new app button in the Your apps to the left. Select 'Android' for the front-end tech and 'Node.js' for the backend tech. (The tech stack you select now doesn't matter as you can always change it later. Its purpose is to generate the starter code that you will need to start communicating with Pusher.)

After creating the new app, go to the App Keys tab and copy your App ID, Key, and Secret credentials. We will use them later in the tutorial.

## Setup the Node.js server
Now that you have your Pusher Keys, let's get on with building the chat application server.

First, generate a Node.js application using this command:

```bash
npm init -y
```

Next, install Express, Pusher and some other dependencies the server will be needing:

```bash
npm install --save express body-parser pusher
```

Express is the web server library that we will be using to accept HTTP requests from the Android app when the user starts typing, and body-parser will be used to parse the incoming requests. The Pusher Node.js library will be used to publish user_typing events through the Pusher API.

When done, the dependency section of your package.json file should look like this:

```json
"dependencies": {
  "express": "^4.14.1",
  "body-parser": "^1.16.0",
  "pusher": "^1.5.1"
}
```

To serve our application we need to do three things:

1. Set up Express and Pusher.
2. Create routes to listen for web requests.
3. Start the Express server.

### 1. Setup Express and Pusher

Create a file and name it `server.js`. Inside it, we initialize Express and Pusher like this:

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Pusher = require('pusher');

const app = express();

//Initialize Pusher
const pusherConfig = {
  appId: 'YOUR_PUSHER_APP_ID',
  key: 'YOUR_PUSHER_KEY',
  secret: 'YOUR_PUSHER_SECRET',
  encrypted: true
};
const pusher = new Pusher(pusherConfig);

app.use(bodyParser.urlencoded({extended: true}));
```

Remember to replace the parameters in the `pusherConfig` object with the Pusher credentials you copied earlier from the Pusher dashboard.

### 2. Create routes to serve our application

Create a route that uses Pusher to broadcast a `user_typing` event.

```javascript
const chatChannel = 'anonymous_chat';
const userIsTypingEvent = 'user_typing';

app.post('/userTyping', function(req, res) {
  const username = req.body.username;
  pusher.trigger(chatChannel, userIsTypingEvent, {username: username});
  res.status(200).send();
});
```

This route broadcasts the request's username to everyone who is subscribed to the channel.

### 3. Start the Express server

Start the Express server to listen on the app port 3000.

```javascript
app.listen(3000, function () {
  console.log('Node server running on port 3000');
});
```

Now we have the application server set up. Next, we develop the Android application users will interact with.

## Set up the Android project

Open Android Studio and create a new project. Once Android Studio is done with the project's setup, then it's time to install the project dependencies.

In the dependencies section of the build.gradle file of your application module, add the following:

```groovy
dependencies {
    ...
    implementation 'com.pusher:pusher-java-client:1.4.0'
    implementation 'com.squareup.okhttp3:okhttp:3.3.1'
    implementation 'com.google.code.gson:gson:2.7'
}
```

We will be using [gson](https://github.com/google/gson) to convert JSON messages to Java Objects. For the network requests to our Node.js Server, we will use [okhttp](https://github.com/square/okhttp).

Sync the Gradle project so the modules can be installed and the project built.

Next, let's add the INTERNET permission to our `AndroidManifest.xml` file. This is required because our application will be connecting to Pusher and our Node.js server over the internet.

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.pusher.whoistypingapp">

    <uses-permission android:name="android.permission.INTERNET" />

    <application 
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        ...
    </application>

</manifest>
```

### The chat activity layout
Next, open the `activity_main.xml` layout file and modify it to look like this:

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/activity_main"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:paddingBottom="@dimen/activity_vertical_margin"
    android:paddingLeft="@dimen/activity_horizontal_margin"
    android:paddingRight="@dimen/activity_horizontal_margin"
    android:paddingTop="@dimen/activity_vertical_margin"
    tools:context="com.pusher.whoistypingapp.MainActivity">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true"
        android:orientation="horizontal">

        <EditText
            android:id="@+id/messageEditText"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:hint="Enter Message Here"
            android:layout_weight="1"/>

        <Button
            android:id="@+id/sendButton"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Send"
            android:layout_weight="4"/>
    </LinearLayout>

</RelativeLayout>
```

The layout consists of an EditText where the user can enter a message, and a Button beside it to act as the 'send message' button.

### The typing indicator model

We will need to represent the 'who's typing' message as a Plain Old Java Object so it can be easily deserialized by gson. To do this, create the class com.pusher.whoistypingapp.WhosTyping and populate it as shown below:

```java
package com.pusher.whoistypingapp;


public class WhosTyping {
    public String username;

    public WhosTyping(String username) {
        this.username = username;
    }
}
```

This WhosTyping class corresponds to JSON of the following structure:

```json
{
  "username": "Any Name"
}
```

### The chat activity

Now open the class `com.pusher.whoistypingapp.MainActivity`. First, let's start by declaring all the required constants:

```java
public class MainActivity extends AppCompatActivity {

  private static final String USER_TYPING_ENDPOINT = "https://{NODE_JS_SERVER_ENDPOINT}/userTyping";
  private static final String PUSHER_API_KEY = "PUSHER_API_KEY";
  private static final String CHANNEL_NAME = "anonymous_chat";
  private static final String USER_TYPING_EVENT = "user_typing";

  ...
```

Remember to replace the `USER_TYPING_ENDPOINT` with the actual hostname (or IP address) of the Node.js server (more on this later) and also the `PUSHER_API_KEY` with the Pusher Key you copied earlier from the Pusher dashboard.

Next, we declare the private variables that will be required for `MainActivity` to function:

```java
  ...
  Pusher pusher = new Pusher(PUSHER_API_KEY);
  OkHttpClient httpClient = new OkHttpClient();

  EditText messageEditText;
  ...
```

### Publishing `user_typing` event

First, let's implement publishing the `user_typing` event to our Node.js server. To do this, we create a `TextWatcher` inside the `onCreate` method.

```java
public class MainActivity extends AppCompatActivity {
    ...
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    TextWatcher messageInputTextWatcher = new TextWatcher() {
      ...
      @Override
      public void onTextChanged(CharSequence charSequence, int start, int before, int count) {
        Log.d("User Input Change", charSequence.toString());
        Request userIsTypingRequest = new Request.Builder()
          .url(USER_TYPING_ENDPOINT)
          .post(new FormBody.Builder()
                  .add("username", getCurrentUsername())
                  .build())
          .build();

        httpClient.newCall(userIsTypingRequest)
          .enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d("Post Response", e.toString());
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                Log.d("Post Response", response.toString());
            }
          });
      }
      ...
    };

    ...
```

Inside the `onTextChanged` method of the TextWatcher, we build the `userIsTypingRequest` and then send the request to the `USER_TYPING_ENDPOINT` URL. For simplicity, we just log the response we get for the server.

Then we add the text change listener to the `messageEditText` as shown below.

```java
  ...
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    ...
    messageEditText = (EditText)findViewById(R.id.messageEditText);
    messageEditText.addTextChangedListener(messageInputTextWatcher);
    ...
  }
```

Now, whenever a user starts typing, a request is sent to the server and the server will in turn broadcast the typing event to all other users.

Next, we need to subscribe to the `user_typing` event.

### Subscribing to user_typing event

We create a `SubscriptionEventListener` that will respond when a `user_typing` event arrives:

```java
  ...
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    ...

    SubscriptionEventListener isTypingEventListener = new SubscriptionEventListener() {
      @Override
      public void onEvent(String channel, String event, String data) {
        final WhosTyping whosTyping = new Gson().fromJson(data, WhosTyping.class);
        if(!whosTyping.username.equals(getCurrentUsername())) {
          runOnUiThread(new Runnable() {
            @Override
            public void run() {
              getSupportActionBar().setSubtitle(whosTyping.username + " is typing...");
            }
          });
        }
      }
    }; 

    ...      
  }
```

Here, the JSON string we receive is converted to a `WhosTyping` object using gson. Then we check if the username of the `WhosTyping` object is equal to the current username before we update the UI. The typing indicator message is shown as subtitle text on the [Action Bar](https://material.io/guidelines/layout/structure.html#structure-app-bar).

Then we subscribe and bind the `isTypingEventListener` to the `user_typing` event:

```java
  ...
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    ...

    Channel pusherChannel = pusher.subscribe(CHANNEL_NAME);
    pusherChannel.bind(USER_TYPING_EVENT, isTypingEventListener);         
  }
```

The application now updates the UI with the username of 'who's typing'. But the typing indicator message needs to be cleared when the user stops typing or else the message stays forever. An easy solution is to set a timer that clears the typing message after some seconds of not receiving an event. From experience, a clear timer of 0.9 seconds has given the best results.

To set the clear timer, we use the `java.util.Timer` and `java.util.TimerTask` classes. First, let us create a method that starts the clear timer:

```java
public class MainActivity extends AppCompatActivity {
  ...

  TimerTask clearTimerTask;
  Timer clearTimer;

  private void startClearTimer() {
    clearTimerTask = new TimerTask() {
        @Override
        public void run() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                  getSupportActionBar().setSubtitle("");
                }
            });
        }
      };
    clearTimer = new Timer();
    long interval = 900; //0.9 seconds
    clearTimer.schedule(clearTimerTask, interval);
  }
  ...
```

The clearTimerTask will clear the Action Bar's subtitle when it is invoked by the clearTimer after 0.9 seconds.

Next, we update the onEvent method of our SubscriptionEventListener to start the clear timer.

```java
  ...
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    ...

    SubscriptionEventListener isTypingEventListener = new SubscriptionEventListener() {
      @Override
      public void onEvent(String channel, String event, String data) {
        ...

        //reset timer
        if(clearTimer != null) {
          clearTimer.cancel();
        }
        startClearTimer();
      }
    }; 

    ...      
  }
```

And there you have it. The chat application now has the functionality to display who's currently typing.

Finally, override the `onResume()` and `onPause()` methods of `MainActivity` to connect and disconnect the `pusher` object respectively.

```java
public class MainActivity extends AppCompatActivity {
  ...

  @Override
  protected void onResume() {
      super.onResume();
      pusher.connect();
  }

  @Override
  protected void onPause() {
      pusher.disconnect();
      super.onPause();
  }

}
```

## Testing

First, ensure you have updated your the `PUSHER_API_KEY` in the `MainActivity` class with your Pusher Key.

Run the Android application either using a real device or a virtual one. You should see an interface like this:

<p style="text-align:center">
<img src="https://images.contentful.com/1es3ne0caaid/2YqFNSl5sQe62YUYSAUa2W/90af3bf00c30966da0a7426fe3b2aecb/typing-indicator-android-launch-view.png" />
</p>

### Testing with the debug console

The easiest way to test the Android application is through the [Pusher Debug Console on your Dashboard](https://dashboard.pusher.com/). At the Debug Console for your app on Pusher, click to show the event creator and then fill the *Channel*, *Event* and *Data* field as shown in the image below:

![](https://images.contentful.com/1es3ne0caaid/5CNXkC3XigQmEq2w8aeUcg/d1a97363850c57829896ce740f79629d/typing-indicator-android-debug-console.png)

When you click the ‘Send event’ button, the interface of your Android application will update to indicate the ‘username is typing…’ message at the top of the page as shown in the image below:

<p style="text-align:center">
<img src="https://images.contentful.com/1es3ne0caaid/17JBwKOSVc4ciqgeE0sS6i/213d93ae48c9a2911d89093cb91c83fc/typing-indicator-android-demo.png" />
</p>

### Testing with the Node.js server

To test the application with the Node.js server, you will need to make the server available to the Android application either by hosting it live or maybe using a tunneling tool like [ngrok](https://ngrok.com/).

Then update the `USER_TYPING_ENDPOINT` constant in the `MainActivity` class with the server's URL. Now to test, you need to run the Android application on two devices. When you start typing in one, you should notice the other device shows that you are currently typing.

## Conclusion

In this tutorial, we saw how to build a typing indicator in an Android app using Pusher.
