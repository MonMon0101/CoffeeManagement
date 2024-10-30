import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const ChoseBuyOption = ({ option, value, active = false, onChoseOption = (value) => {} }) => {
    return (
        <TouchableOpacity
            onPress={() => onChoseOption?.(value)}
            className="flex-row items-center gap-2 mb-2"
        >
            {active ? (
                <MaterialCommunityIcons name="radiobox-marked" size={24} color="black" />
            ) : (
                <MaterialCommunityIcons name="radiobox-blank" size={24} color="black" />
            )}
            <Text>{option}</Text>
        </TouchableOpacity>
    );
};

export default ChoseBuyOption;

const styles = StyleSheet.create({});
