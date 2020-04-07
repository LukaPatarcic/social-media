import React from 'react';
import Splash from "../screens/Splash";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Feed from "../screens/Feed";
import {AuthContext} from "../context/AuthProvider";
import NavigationContainer from "@react-navigation/native/src/NavigationContainer";
import {CardStyleInterpolators, createStackNavigator, TransitionPresets} from "@react-navigation/stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Profile from "../screens/Profile";
import RegisterTwo from "../screens/RegisterTwo";
import RegisterThree from "../screens/RegisterThree";
import {Easing} from "react-native";


export default class Router extends React.Component{
    render() {
        return (
            <AuthContext.Consumer>
                {(context) => {
                    return(
                        <NavigationContainer>
                            <RootStackScreen state={context.state} />
                        </NavigationContainer>
                    )
                }}
            </AuthContext.Consumer>
        )
    }
}

const SplashStack = createStackNavigator();
const SplashStackScreen = () => (
    <SplashStack.Navigator>
        <SplashStack.Screen
            name="Splash"
            component={Splash}
            options={{headerShown: false}}
        />
    </SplashStack.Navigator>
);

const config = {
    animation: 'timig',
    config: {
        stiffness: 1000,
        damping: 50,
        easing: Easing.linear,
        mass: 3,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },
};

const closeConfig = {
    animation: ''
}

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
    <AuthStack.Navigator
        headerMode={"float"}
        screenOptions={{
            gestureDirection: 'horizontal',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}
    >
        <AuthStack.Screen
            name="Login"
            component={Login}
            options={{
                headerShown: false
            }}
        />
        <AuthStack.Screen
            name="Register"
            component={Register}
            options={{ headerStyle: {
                    backgroundColor: '#f2f2f2',
                },
                headerTintColor: '#000',
                title: 'Name',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontFamily: 'font'
                }
            }}
        />
        <AuthStack.Screen
            name="RegisterTwo"
            component={RegisterTwo}
            options={{ headerStyle: {
                    backgroundColor: '#f2f2f2',
                },
                headerTintColor: '#000',
                title: 'Account',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontFamily: 'font'
                },}}
        />
        <AuthStack.Screen
            name="RegisterThree"
            component={RegisterThree}
            options={{ headerStyle: {
                    backgroundColor: '#f2f2f2',
                },
                headerTintColor: '#000',
                title: 'Password',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontFamily: 'font'
                },}}
        />
    </AuthStack.Navigator>
);

const FeedStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const FeedStackScreen = () => (
    <FeedStack.Navigator>
        <FeedStack.Screen
            name="Feed"
            component={Feed}
            options={{headerShown: false}}
        />
        {/*<FeedStack.Screen*/}
        {/*    name="Details"*/}
        {/*    component={Details}*/}
        {/*    options={({ route }) => ({*/}
        {/*        title: route.params.name*/}
        {/*    })}*/}
        {/*/>*/}
    </FeedStack.Navigator>
);

const ProfileStackScreen = () => (
    <ProfileStack.Navigator>
        <ProfileStack.Screen
            name="Profile"
            component={Profile}
            options={{headerShown: false}}
        />
        {/*<FeedStack.Screen*/}
        {/*    name="Details"*/}
        {/*    component={Details}*/}
        {/*    options={({ route }) => ({*/}
        {/*        title: route.params.name*/}
        {/*    })}*/}
        {/*/>*/}
    </ProfileStack.Navigator>
);

const Tabs = createBottomTabNavigator();
const TabsScreen = () => (
    <Tabs.Navigator>
        <Tabs.Screen name="Home" component={FeedStackScreen} />
        <Tabs.Screen name="Search" component={ProfileStackScreen} />
    </Tabs.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({ state }) => (
    <RootStack.Navigator headerMode="none">
        {state.isLoading ?
            (
                <RootStack.Screen
                    name="Splash"
                    component={SplashStackScreen}
                    options={{
                        animationEnabled: false,
                    }}
                />
            )
            :
            (state.isAuth ?
                (
                    <RootStack.Screen
                        name="App"
                        component={TabsScreen}
                        options={{
                            animationEnabled: false
                        }}
                    />
                )
                :
                (
                    <RootStack.Screen
                        name="Auth"
                        component={AuthStackScreen}
                        options={{
                            animationEnabled: false
                        }}
                    />
                )
            )
        }
    </RootStack.Navigator>
);