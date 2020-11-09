import { Entypo, FontAwesome5, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from './styles';

const InputBox = () => {
    const [message, setMessage] = useState('');

    const onMicroPhonePress = () => {
        console.warn("Microphone");
    }

    const onPress = () => {
        if(!message) {
            onMicroPhonePress();
        } else {
            onSendPress();
        }
    }

    const onSendPress = () => {
        console.warn(`Sending: ${message}`);

        // send the message to the backend

        setMessage('');
    }

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
                {!message && <Fontisto name="camera" size={24} color="grey" style={styles.icons} />}
            </View>
            <TouchableOpacity onPress={onPress}>
                <View style={styles.buttonContainer}>
                    {!message 
                        ? <MaterialCommunityIcons name="microphone" size={28} color="white" /> 
                        : <MaterialIcons name="send" size={28} color="white" />
                    }
                </View>
            </TouchableOpacity>
        </View>
    )
};

export default InputBox;