import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

const QuantityInput = ({ quantity = 0, onIncrement, onDecrement }) => {
    return (
        <View className="flex-row items-center gap-2">
            <TouchableOpacity onPress={onDecrement} className="p-1 bg-white rounded-lg">
                <AntDesign name="minus" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-lg font-bold min-w-10 max-w-[50px]">{quantity}</Text>
            <TouchableOpacity onPress={onIncrement} className="p-1 bg-white rounded-lg">
                <AntDesign name="plus" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );
};

export default QuantityInput;

const styles = StyleSheet.create({});
