import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import PATHS from "~/constants/path.constant";
import { navigate } from "~/routes/config/navigation";
import { themeColors } from "~/theme";

export default function TableStaff({ item, onDelete = (id = "") => {} }) {
    return (
        <TouchableOpacity
            onPress={() => navigate(PATHS.ADD_EDIT_STAFF, { id: item.id })}
            style={{ shadowColor: themeColors.bgColor(1) }}
            className="w-full flex-row p-3 shadow-xl bg-white rounded-lg gap-1 items-center justify-between"
        >
            <View className="flex-column shadow-2xl bg-white rounded-lg" style={{ gap: 10 }}>
                <Text className="text-lg font-semibold block">{`ID: ${item.id}`}</Text>
                <Text className="text-lg font-semibold block">{`TK: ${item.username}`}</Text>
                <Text className="text-lg font-semibold">{`Tên: ${item.displayName}`}</Text>
            </View>

            <TouchableOpacity onPress={() => onDelete(item.id)}>
                <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}
