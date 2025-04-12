import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Stack, Link} from "expo-router";
import { Pressable } from "react-native";
import Toast from 'react-native-toast-message';

export default function menuStack() {
    return <Stack>
        <Stack.Screen name="index" options={{title:"Menu",
          headerRight: () => (
            <Link href="/(admin)/menu/create" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="plus-square-o"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}/>
         <Toast />
    </Stack>
}