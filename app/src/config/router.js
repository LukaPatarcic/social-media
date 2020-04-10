import React from 'react';
import Splash from "../screens/Splash";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Feed from "../screens/Feed";
import {AuthContext} from "../context/AuthProvider";
import NavigationContainer from "@react-navigation/native/src/NavigationContainer";
import {CardStyleInterpolators, createStackNavigator, TransitionPresets} from "@react-navigation/stack";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Profile from "../screens/Profile";
import RegisterTwo from "../screens/RegisterTwo";
import RegisterThree from "../screens/RegisterThree";
import {Easing, Image, ImageBackground, Linking, Text, View} from "react-native";
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import Search from "../screens/Search";
import Notifications from "../screens/Notifications";
import Stats from "../screens/Stats";
import Icon from "react-native-vector-icons/FontAwesome";
import Comments from "../screens/Comments";
import {Badge} from "react-native-paper";


export default class Router extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            url: null
        }
    }

    componentDidMount() {
        Linking.getInitialURL().then(url => {
            if(url) {
                this._handleOpenURL(url)
            }
        });

        Linking.addEventListener('url', (e) =>this._handleOpenURL(e.url));
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', (e) =>this._handleOpenURL(e.url));
    }

    _handleOpenURL(url) {
        console.log(url);
    }

    render() {

        return (
            <AuthContext.Consumer>
                {(context) => {
                    return(
                        <NavigationContainer>
                            <RootStackScreen state={{...context.state,...this.state}} />
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
            route={'splash'}
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
            path={'login'}
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
            path={'register'}
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
            path={'register/account'}
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
            path={'register/password'}
        />
    </AuthStack.Navigator>
);

const FeedStack = createStackNavigator();
const ProfileStack = createDrawerNavigator();
const SearchStack = createStackNavigator();
const StatsStack = createStackNavigator();
const NotificationStack = createStackNavigator();

const FeedStackScreen = () => (
    <FeedStack.Navigator>
        <FeedStack.Screen
            name="Feed"
            component={Feed}
            options={{
                headerTitle: props =>
                    <View style={{flex:1,flexDirection: 'row',alignItems:'center',justifyContent:'center'}}>
                        <Image  style={{width: 30, height: 30}} source={require('../../assets/images/logo.png')} />
                        <Text style={{fontSize: 17,fontFamily:'font',marginLeft: 3,marginTop:2}}>Allshack</Text>
                    </View>,
                headerRight: () => (
                    <Icon
                        onPress={() => alert('This is a button!')}
                        name={'comments'}
                        size={30}
                        style={{marginRight: 10}}
                    />
                ),
            }}
        />
        <FeedStack.Screen
            name="Comments"
            component={Comments}
        />
    </FeedStack.Navigator>
);

const SearchStackScreen = () => (
    <SearchStack.Navigator>
        <SearchStack.Screen
            name="Search"
            component={Search}
            options={{headerShown: false}}
        />
    </SearchStack.Navigator>
);

const NotificationStackScreen = () => (
    <NotificationStack.Navigator>
        <NotificationStack.Screen
            name="Notifications"
            component={Notifications}
            options={{headerShown: false}}
        />
    </NotificationStack.Navigator>
);

const StatsStackScreen = () => (
    <StatsStack.Navigator>
        <StatsStack.Screen
            name="Stats"
            component={Stats}
            options={{headerShown: false}}
        />
    </StatsStack.Navigator>
);

const ProfileStackScreen = () => (
    <ProfileStack.Navigator drawerPosition={'right'}>
        <ProfileStack.Screen
            name="Profile"
            component={Profile}
        />
    </ProfileStack.Navigator>
);

const Tabs = createMaterialBottomTabNavigator();
const TabsScreen = () => (
    <Tabs.Navigator  initialRouteName="Feed"
                     activeColor="#fff"
                     backBehavior={'initialRoute'}
    >
        <Tabs.Screen
            name="Feed"
            options={{
                tabBarLabel: 'Feed',
                tabBarColor: '#f00',
                tabBarIcon: ({ color }) => (
                    <Icon name="home" color={color} size={26} />
                ),
            }}
            component={FeedStackScreen}
        />
        <Tabs.Screen
            name="Search"
            options={{
                tabBarLabel: 'Search',
                tabBarColor: '#f00',
                tabBarIcon: ({ color }) => (
                    <Icon name="search" color={color} size={26} />
                    )
            }}
            component={SearchStackScreen} />
        <Tabs.Screen
            name="Notifications"
            component={NotificationStackScreen}
            options={{
                tabBarLabel: 'Notifications',
                tabBarColor: '#f00',
                tabBarActiveTextColor: '#000',
                tabBarBadgeStyle: {color: 'black'},
                tabBarIcon: ({ color }) => {
                    return (
                        <>
                            <Icon size={26} color={color} name={'bell'} />

                            <Badge
                                style={{ position: 'absolute', top: -8, right: -8,backgroundColor:'#000' }}
                            >10</Badge>
                        </>
                    )
                },
            }}
        />
        <Tabs.Screen
            name="Stats"
            options={{
                tabBarLabel: 'Stats',
                tabBarColor: '#f00',
                tabBarIcon: ({ color }) => (
                    <Icon name="pie-chart" color={color} size={26} />
                ),
            }}
            component={StatsStackScreen}
        />
        <Tabs.Screen
            name="Profile"
            options={{
                tabBarLabel: 'Profile',
                tabBarColor: '#f00',
                tabBarIcon: ({ color }) => (
                    <Icon name="user" color={color} size={26} />
                ),
            }}
            component={ProfileStackScreen}
        />
    </Tabs.Navigator>
);

const RootStack = createStackNavigator();
const RootStackScreen = ({ state }) => (
    <RootStack.Navigator headerMode="none" path={'register'}>
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