import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BLUR_HASH } from "~/constants/image.constant";
import PATHS from "~/constants/path.constant";
import { navigate } from "~/routes/config/navigation";
import { themeColors } from "~/theme";
import { formatPrice } from "~/utils/number";

export default function ProductCard({ item, onDelete = (id = "") => {} }) {
    const price = useMemo(() => {
        return item.discount ? item.price - (+item.discount / 100) * item.price : item.price;
    }, [item.price]);

    return (
        <TouchableOpacity
            onPress={() => navigate(PATHS.ADD_EDIT_PRODUCT, { id: item.id })}
            style={{ shadowColor: themeColors.bgColor(1) }}
            className="shadow-xl w-full flex-row bg-white rounded-lg space-x-2"
        >
            <View className="h-36 w-36">
                <Image
                    source={{ uri: item?.image }}
                    className="h-full w-full rounded-tl-lg rounded-bl-lg"
                    placeholder={BLUR_HASH}
                    transition={500}
                />
            </View>

            <View className="flex-1 flex-grow flex-col space-y-1 pr-1">
                <Text className="text-base font-semibold" numberOfLines={1}>
                    {item.name}
                </Text>

                <Text className="text-sm italic text-gray-500" numberOfLines={1}>
                    {item.description}
                </Text>

                <Text className="text-sm italic text-gray-500" numberOfLines={1}>
                    {`Danh mục: ${item.category?.name}`}
                </Text>

                <Text
                    className="text-base font-bold"
                    numberOfLines={1}
                    style={{ width: 140, color: themeColors.text }}
                >
                    {formatPrice(price)}
                </Text>

                <TouchableOpacity onPress={() => onDelete(item.id)}>
                    <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}
