import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import Header from "~/components/ui/Header";
import PATHS from "~/constants/path.constant";

const useAppBar = ({ options = {}, title, isShowGoBackHome = false, pathHome = PATHS.HOME }) => {
    const navigation = useNavigation();

    useLayoutEffect(() => {
        const optionsConfigDefault = {
            header: ({ navigation, route, options, back }) => {
                return (
                    <Header
                        name={title}
                        isBack={back}
                        isShowGoBackHome={isShowGoBackHome}
                        pathHome={pathHome}
                    />
                );
            },
            headerShown: true,
            statusBarAnimation: "fade",
            statusBarHidden: false,
            statusBarTranslucent: true,
            ...options,
        };

        navigation.setOptions(optionsConfigDefault);
    }, [options, title]);
};

export default useAppBar;
