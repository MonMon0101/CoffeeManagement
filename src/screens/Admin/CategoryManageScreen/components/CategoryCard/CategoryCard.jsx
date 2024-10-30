import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { themeColors } from "~/theme";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { navigate } from "~/routes/config/navigation";
import PATHS from "~/constants/path.constant";
import { BLUR_HASH } from "~/constants/image.constant";

export default function CategoryCard({ item, onDelete = (id = "") => {} }) {
    return (
        <TouchableOpacity
            onPress={() => navigate(PATHS.ADD_EDIT_CATE, { id: item.id })}
            style={{ shadowColor: themeColors.bgColor(1) }}
            className="w-full flex-row p-3 shadow-xl bg-white rounded-lg gap-1 items-center justify-between"
        >
            <View
                className="flex-row shadow-2xl bg-white rounded-lg items-center"
                style={{ gap: 10 }}
            >
                <Image
                    source={{ uri: item?.image }}
                    className="h-12 w-12 rounded-md"
                    placeholder={BLUR_HASH}
                    transition={500}
                />

                <Text>{`${item.name}`}</Text>
            </View>

            <TouchableOpacity onPress={() => onDelete(item.id)}>
                <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}
