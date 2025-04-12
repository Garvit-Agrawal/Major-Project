import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Stack, Link} from "expo-router";
import { Pressable } from "react-native";

export default function menuStack() {
    return <Stack>
        {/* <Stack.Screen name="index" options={{title:"Orders"}}/> */}
        <Stack.Screen name="list" options={{headerShown:false}}/>
    </Stack>
}