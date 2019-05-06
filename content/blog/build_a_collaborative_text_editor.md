---
title: Build a collaborative text editor in Android
date: '2017-05-11T22:12:03.284Z'
tags: ["android", "java", "realtime", "tutorial", "pusher"]
featureImage: ../assets/build_a_typing_indicator_in_android.jpg
followUpPosts: []
---

In this tutorial, we will learn how to build a collaborative text editor in Android. We will be using [Pusher](https://pusher.com/) to make the collaboration part easy.

We will be building a simple Android app and it will have a single activity containing only an `EditText` view. We will then keep track of changes to the `EditText` view and broadcast these changes to other users on the same application. The application will also listen for updates and update the `EditText` with changes received.

Here is a demo of what will be built by the end of this tutorial:

![](https://images.contentful.com/1es3ne0caaid/3HhyeVyZEA8CG4Y26ySCqY/d681b61d6b5f22b82884da1157dba0e0/collaborative-text-editor-android-demo.gif)

Let's get started!

## Create the Android Studio Project

Launch Android Studio and create a new Project. You could name the application anything you want, but for the purpose of this tutorial we will name it 'CollabEditor'. Also, ensure you select the 'Empty Activity' option as the initial Activity and name it `MainActivity` on the 'Customize Activity Page'.

Once Android Studio is done with the project's setup, open the `build.gradle` file of your application's module to add the follow dependencies:

```groovy
dependencies {
    ...
    implementation 'com.pusher:pusher-java-client:1.4.0'
    implementation 'com.google.code.gson:gson:2.7'
}
```

These add Pusher and Gson to our android project. Sync the Gradle project so the modules can be installed and the project built.

Next, Add the INTERNET permission to the `AndroidManifest.xml` file.

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.pusher.collabeditor">

    <uses-permission android:name="android.permission.INTERNET" />

    <application 
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        ...
    </application>

</manifest>
```

## Create the text editor layout

Next, open the `activity_main.xml` layout file and modify it to look like this:

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context="com.pusher.collabeditor.MainActivity">

    <EditText
        android:id="@+id/textEditor"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:hint="Editor is empty. Select to start typing"
        android:gravity="top"/>

</LinearLayout>
```

The layout is quite simple. It contains an `EditText` with its width and height set to `match_parent`.

## Create the 'EditorUpdate' model

Create the class `com.pusher.collabeditor.EditorUpdate` and write the following to it:

```java
package com.pusher.collabeditor;

public class EditorUpdate {

  public String data;

  public EditorUpdate(String data) {
    this.data = data;
  }
}
```

This class when converted to JSON with Gson corresponds to the following structure:

```json
{
  "data": "Editor text will be here"
}
```

This is the structure of JSON that would be sent to other users of the application when updates are made to the text editors content.

## Setting up a Pusher account

If you don't already have a Pusher account, create a free Pusher account [here](https://pusher.com/signup) then log in to your dashboard. Once logged in, create an app by entering an app name (any name will do) and choosing a cluster in the Create App screen. After creating the new app, go to the `App Keys` tab and copy your **App ID**, **Key**, and **Secret** credentials. We will use them in our application.

## Update the MainActivity

Now, back in Android Studio, open the class `com.pusher.collabeditor.MainActivity`.

First let us declare all the required constants and variables for the application:

```java
public class MainActivity extends AppCompatActivity {

  private static final String DEBUG_TAG = MainActivity.class.getSimpleName();
  private static final String PUSHER_API_KEY = "YOUR PUSHER APP KEY";
  private static final String PUSHER_CLUSTER = "PUSHER APP CLUSTER";
  private static final String AUTH_ENDPOINT = "PUSHER AUTHENTICATION ENDPOINT";

  private Pusher pusher;
  private EditText textEditor;
  private TextWatcher textEditorWatcher;
  ```

Ensure you replace those variable values with your own Pusher credentials. I'll explain how to get the `AUTH_ENDPOINT` value later in this tutorial.

Next, in the `onCreate` method, set the content view and initialize the Pusher object like this:

```java
...

@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    textEditor = (EditText) findViewById(R.id.textEditor);

    pusher = new Pusher(PUSHER_API_KEY, new PusherOptions()
      .setEncrypted(true)
      .setCluster(PUSHER_CLUSTER)
      .setAuthorizer(new HttpAuthorizer(AUTH_ENDPOINT)));

}
```

We set an authorizer because we are going to be using [Pusher's Client Events](https://pusher.com/docs/client_api_guide/client_events#trigger-events) to broadcast changes on the text editor to other users of the application. An advantage of this is that we don't need to route our updates through a server.

## Using Pusher's Client Events

To use Pusher's *Client Events*, it needs to be enabled for your Pusher app. You can do this in the *Settings* tab for your app within the [Pusher's dashboard](https://dashboard.pusher.com/). *Client Events* can only be broadcast on a private channel and event names must start with the prefix `client-`.

To use private channels, the Pusher client must be authenticated hence the reason for the `AUTH_ENDPOINT`. Pusher makes writing an auth server easy. I used their Node.js template [here](https://pusher.com/docs/authenticating_users#implementing_private_endpoints). Once set up, update the `AUTH_ENDPOINT` of your code to the URL of the auth server.

With all this in mind, we now go back to the Android code. After initializing the Pusher client, we create a `PrivateChannelEventListener`:

```java
...

@Override
protected void onCreate(Bundle savedInstanceState) {
    ...

    PrivateChannelEventListener subscriptionEventListener = new PrivateChannelEventListener() {

        @Override
        public void onEvent(String channel, String event, final String data) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    EditorUpdate editorUpdate = new Gson().fromJson(data, EditorUpdate.class);
                    textEditor.setText(editorUpdate.data);
                }
            });
        }

        @Override
        public void onAuthenticationFailure(String message, Exception e) {
            Log.d(DEBUG_TAG, "Authentication failed.");
            Log.d(DEBUG_TAG, message);
        }

        @Override
        public void onSubscriptionSucceeded(String message) {
            Log.d(DEBUG_TAG, "Subscription Successful");
            Log.d(DEBUG_TAG, message);
        }
    };

    ...   
}
```

When an event is received in the `onEvent` method, we convert the JSON data to an `EditorUpdate` object using Gson and then update the editor's text with the data received.

Next, we subscribe to our private channel and bind the event listener to client events on the channel.

```java
final PrivateChannel editorChannel = pusher.subscribePrivate(
  "private-editor",
  subscriptionEventListener
);
noteChannel.bind("client-update", subscriptionEventListener);
```

Now, the text editor will update its content whenever it receives a `client-update` event.

Next, we need to add a `TextWatcher` to our `textEditor`:

```java
textEditorWatcher = new TextWatcher() {
    @Override
    public void beforeTextChanged(CharSequence charSequence, int start, int count, int after) {
    }

    @Override
    public void onTextChanged(CharSequence charSequence, int start, int before, int count) {
        String text = charSequence.toString();
        EditorUpdate editorUpdate = new EditorUpdate(text);
        noteChannel.trigger("client-update", new Gson().toJson(editorUpdate));
    }

    @Override
    public void afterTextChanged(Editable editable) {}
};

textEditor.addTextChangedListener(textEditorWatcher);
```

So when text changes on the editor, we trigger a `client-update` event on the editor channel. After this ensure that you connect and disconnect your Pusher client in the `onResume()` and `onPause()` methods respectively.

```java
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
```

With this, our Android application is almost fully functional. If you were to run and test the Android application now, you would notice an endless update loop in the `EditText` whenever it receives an `client-update` event.

This loop is because when a `client-update` event is received, `textEditor.setText()` is called which in turn triggers `textEditorWatcher.onTextChanged()` and this causes another `client-update` to be sent to other applications which would restart the loop process. Below is an image showing how this looks like between two apps:

![](https://images.contentful.com/1es3ne0caaid/4CDwc5sHHqUC2EGWUWsqa0/71bf64c611670c213472c73488bb2ae1/collaborative-text-editor-android-endless-loop.jpg)

## Fixing the EditText update loop

To fix this endless update loop, we will remove the `textEditorWatcher` from the `textEditor` before we call `textEditor.setText()` and then add it back afterwards.

```java
...
PrivateChannelEventListener subscriptionEventListener = new PrivateChannelEventListener() {

    @Override
    public void onEvent(String channelName, String eventName, final String data) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Log.d(DEBUG_TAG, data);
                EditorUpdate editorUpdate = new Gson().fromJson(data, EditorUpdate.class);
                //remove textEditorWatcher
                textEditor.removeTextChangedListener(textEditorWatcher);
                textEditor.setText(editorUpdate.data);
                //add it back afterwards
                textEditor.addTextChangedListener(textEditorWatcher);
            }
        });
    }

    ...
};
...
```

So this way, `textEditor.setText()` doesn't call `textEditorWatcher.onTextChanged()` and therefore the loop doesn't happen.

Now, our collaborative text editor Android app is fully functional. Yay!

## Testing the application

To test the Android application, you will need to build and run the application on multiple devices (or you could just run it on multiple Android emulators). Any edit you make on an application's text editor will be seen in the other applications running.

## Conclusion

In this tutorial, we have seen how to build a collaborative text editor in Android using Pusher's *Client Events*. Some extra things to note about this tutorial are:

- This Android app doesn’t account for concurrent edits at the same place in the editor. You can use a technique called [Operational Transforms](http://operational-transformation.github.io/) to solve this.
- Client Events have a number of restrictions that are important to know about, one of which is the limit to the number of events that can be published per seconds. Read more about them [here](https://pusher.com/docs/client_api_guide/client_events#trigger-events).