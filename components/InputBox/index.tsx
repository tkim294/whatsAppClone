import {
  Entypo,
  FontAwesome5,
  Fontisto,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styles from "./styles";

import { API, Auth, graphqlOperation } from "aws-amplify";

import { createMessage } from "../../graphql/mutations";

const InputBox = (props) => {
  const { chatRoomID } = props;

  const [message, setMessage] = useState("");
  const [myUserId, setMyUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await Auth.currentAuthenticatedUser();
      setMyUserId(userInfo.attributes.sub);
    };
    fetchUser();
  }, []);

  const onMicroPhonePress = () => {
    console.warn("Microphone");
  };

  const onPress = () => {
    if (!message) {
      onMicroPhonePress();
    } else {
      onSendPress();
    }
  };

  const onSendPress = async () => {
    try {
      await API.graphql(
        graphqlOperation(createMessage, {
          input: {
            content: message,
            userID: myUserId,
            chatRoomID
          },
        })
      );
    } catch (e) {
      console.log(e);
    }

    setMessage("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <FontAwesome5 name="laugh-beam" size={24} color="grey" />
        <TextInput
          placeholder={"Type a message"}
          style={styles.textInput}
          multiline
          value={message}
          onChangeText={setMessage}
        />
        <Entypo name="attachment" size={24} color="grey" style={styles.icons} />
        {!message && (
          <Fontisto name="camera" size={24} color="grey" style={styles.icons} />
        )}
      </View>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.buttonContainer}>
          {!message ? (
            <MaterialCommunityIcons name="microphone" size={28} color="white" />
          ) : (
            <MaterialIcons name="send" size={28} color="white" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default InputBox;
