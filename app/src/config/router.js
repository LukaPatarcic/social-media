import React, {useEffect, useState} from 'react';
import Splash from "../screens/Splash";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Feed from "../screens/Feed";
import {AuthContext} from "../context/AuthProvider";
import { NavigationContainer } from '@react-navigation/native';
import {CardStyleInterpolators, createStackNavigator, TransitionPresets} from "@react-navigation/stack";
import Profile from "../screens/Profile";
import RegisterTwo from "../screens/RegisterTwo";
import RegisterThree from "../screens/RegisterThree";
import {AsyncStorage, Easing, Image, ImageBackground, Linking, Text, ToastAndroid, View} from "react-native";
import {createMaterialBottomTabNavigator} from "@react-navigation/material-bottom-tabs";
import Search from "../screens/Search";
import Notifications from "../screens/Notifications";
import Icon from "react-native-vector-icons/FontAwesome";
import Comments from "../screens/Comments";
import {Badge} from "react-native-paper";
import AddPost from "../components/AddPost";
import Messages from "../screens/Messages";
import MessagesWithUser from "../components/MessagesWithUser";
import NewMessage from "../components/NewMessage";
import {BASE_URL} from "./index";
import Follow from "../screens/Follow";


export default function Router(){
    const linking = {
        prefixes: ['https://allshack.lukauku.tech/','allshack://'],
        config: {

        }
    }

    return (
        <AuthContext.Consumer>
            {(context) => {
                return(
                    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
                        <RootStackScreen state={{...context}} />
                    </NavigationContainer>
                )
            }}
        </AuthContext.Consumer>
    )
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
const ProfileStack = createStackNavigator();
const SearchStack = createStackNavigator();
const NotificationStack = createStackNavigator();

const FeedStackScreen = (navigation) => (
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
                        onPress={() => navigation.navigation.navigate('Messages')}
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
        <FeedStack.Screen
            name={"Messages"}
            component={Messages}
            options={{
                // headerShown: false,
                title: 'Message a friend'
            }}
        />
        <FeedStack.Screen
            name={"MessagesWithUser"}
            component={MessagesWithUser}
            options={({route}) => ({
                title: route.params.user.profileName
            })}
        />
        <FeedStack.Screen
            name={"NewMessage"}
            component={NewMessage}
            options={{
                headerShown: false
            }}
        />
        <FeedStack.Screen
            name="Post"
            component={AddPost}
            initialParams={{test: 1}}
            options={{
                headerShown: false
            }}
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

const NotificationStackScreen = (getCount) => (
    <NotificationStack.Navigator>
        <NotificationStack.Screen
            name="Notifications"
            component={Notifications}
            initialParams={{getCount}}
            options={{headerShown: false}}
        />
    </NotificationStack.Navigator>
);

const ProfileStackScreen = () => (
    <ProfileStack.Navigator>
        <ProfileStack.Screen
            name="Profile"
            component={Profile}
            initialParams={{ profileName: '', isMe: true }}
            options={({route}) => ({
                    title: route.params.profileName === '' ? 'Profile' : route.params.profileName
                })
            }
        />
        <ProfileStack.Screen
            name="Follow"
            component={Follow}
            options={(navigation) => ({
                headerTitle: navigation.route.params.following ? "Following" : "Followers"
            })}
        />
    </ProfileStack.Navigator>
);

const Tabs = createMaterialBottomTabNavigator();
const TabsScreen = () => {
    const [count,setCount] = useState(0);

    const getCount = () => {
        AsyncStorage.getItem("access-token")
            .then(token => {
                fetch(BASE_URL+'/friend/request/count',{
                    headers: {
                        'Authorization': 'Bearer '+token
                    }
                })
                    .then(response => response.json())
                    .then(data => setCount(data.count))
                    .catch(err => ToastAndroid.show('Oops... Something went wrong!',ToastAndroid.SHORT));
            })
    }

    useEffect(() => {
        getCount()
    },[])

    return (
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
                component={() => NotificationStackScreen(getCount)}
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
                                >
                                    {count}
                                </Badge>
                            </>
                        )
                    },
                }}
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
    )
}

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