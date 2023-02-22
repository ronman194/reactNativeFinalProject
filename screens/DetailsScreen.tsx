import { FC, useEffect } from "react";
import { View, Text, Button } from "react-native";
import Background from "../tools/Background";

const DetailsScreen: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const firstName = JSON.stringify(route.params.firstName);
    const lastName = JSON.stringify(route.params.lastName);
    const email = JSON.stringify(route.params.email);

    useEffect(() => {
        navigation.setOptions({
            title: 'Deatils' + firstName + " " + lastName
        });
    });
    return (
        <Background>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Details Screen</Text>
                <Text>Email:{email}</Text>
                <Text>{firstName} {lastName}</Text>
            </View>
        </Background>
    );
}

export default DetailsScreen;