import { FC, useEffect } from "react";
import { View, Text, Button } from "react-native";
import Background from "../tools/Background";

const DetailsScreen: FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const itemId = JSON.stringify(route.params.itemId);
    const name = JSON.stringify(route.params.name);

    useEffect(() => {
        navigation.setOptions({
            title: 'Deatils' + itemId
        })
    })
    return (
        <Background>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Details Screen</Text>
                <Text>id:{itemId}</Text>
                <Text>{name}</Text>
                <Button title="Go back" onPress={() => navigation.navigate('Home', { newPstId: 1000 })} />
            </View>
        </Background>
    );
}

export default DetailsScreen;