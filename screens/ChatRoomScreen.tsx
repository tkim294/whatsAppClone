import React, { useEffect, useState } from "react";
import { FlatList, ImageBackground, Text } from "react-native";

import { useRoute } from "@react-navigation/native";

import {API, Auth, graphqlOperation} from 'aws-amplify';

import {messagesByChatRoom} from '../graphql/queries';
import {onCreateMessage} from '../graphql/subscriptions';

import ChatMessage from "../components/ChatMessage";
import BG from '../assets/images/BG.png';
import InputBox from "../components/InputBox";

const ChatRoomScreen = () => {

  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState(null);

  const route = useRoute();


  useEffect(() => {
    const fetchMessages = async () => {
      const messagesData = await API.graphql(
        graphqlOperation(
          messagesByChatRoom, {
            chatRoomID: route.params.id,
            sortDirection: "DESC"
          }
        )
      )
      setMessages(messagesData.data.messagesByChatRoom.items);
    }
    fetchMessages();
  }, [])

  useEffect(() => {
    const getMyId = async () => {
      const userInfo = await Auth.currentAuthenticatedUser();
      setMyId(userInfo.attributes.sub);
    }
    getMyId();
  }, [])

  const addMessageToState = (message)=> {
    setMessages([message, ...messages]);
  };
  
  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage)
    ).subscribe({
      next: (data) => {
        const newMessage = data.value.data.onCreateMessage;

        if(newMessage.chatRoomID !== route.params.id) {
          return;
        }
        addMessageToState(newMessage);
      }
    });
    return () => subscription.unsubscribe();
  }, [])

  return(
    <ImageBackground style={{width: '100%', height: '100%'}} source={BG} >
      <FlatList
          data={messages}
          renderItem={({item}) => <ChatMessage myId={myId} message={item} /> }
          inverted
      />
      <InputBox chatRoomID={route.params.id} />
    </ImageBackground>
  );
};

export default ChatRoomScreen;
