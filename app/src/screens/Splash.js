import React from 'react';
import {
    View,
    StyleSheet,
    Image, ImageBackground, Text,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});


export default class Splash extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ImageBackground
                style={{width: '100%', height: '100%'}}
                source={require('../../assets/images/background-01.png')}
            >
                <View style={styles.container}>
                    <View>
                        <Image
                            style={{width: 150, height: 150}}
                            source={require('../../assets/images/logo.png')} />
                    </View>
                    <Text style={{fontSize: 30,color: '#fff', fontFamily: "font"}}>Allshack</Text>
                </View>
            </ImageBackground>
        );
    }
}
