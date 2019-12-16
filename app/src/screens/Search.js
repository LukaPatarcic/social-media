import React from 'react';
import {View, StyleSheet, ImageBackground,} from 'react-native';
import { Text } from 'native-base';
import { Searchbar } from 'react-native-paper';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
        };
    }

    updateSearch(search) {
        this.setState({ search });
    };

    render() {
        const {search} = this.state;
        return (
            <ImageBackground
                style={{width: '100%', height: '100%',zIndex: -1,resizeMode: 'cover'}}
                source={{uri: 'https://allshak.lukaku.tech/images/background.png'}}>
                <View>
                    <Searchbar
                        inputStyle={{fontFamily: 'font'}}
                        placeholder="Search"
                        onChangeText={query => { this.setState({ search: query }); }}
                        value={search}
                        onIconPress={this.updateSearch}
                    />
                </View>
                {search
                    ?
                    <View>
                        <View style={styles.card}>
                            <View>
                                <Text  style={{fontFamily: 'font'}}>Search results:</Text>
                            </View>
                        </View>
                        <View style={styles.card}>
                            <Text  style={{fontFamily: 'font'}}>{search}</Text>
                        </View>
                    </View>
                    :
                    <Text>""</Text>
                }
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 70,
        alignItems: 'center',
        justifyContent: 'flex-start',
        shadowOffset:{  width: 10,  height: 10,  },
        shadowColor: 'black',
        shadowOpacity: 1.0,
    },
    card: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 20
    }
});
