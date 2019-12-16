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
        setTimeout(() => {
            this.props.history.push('/user')
        },1000);
        return (
            <View style={styles.container}>
                <Image
                    style={{width: 150, height: 150}}
                    source={{uri: 'https://allshak.lukaku.tech/images/logo.png'}} />
                <Text style={{fontSize: 30,color: '#fff', fontFamily: "font"}}>Allshak</Text>
            </View>
        );
    }
}
