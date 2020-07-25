import React, {Component} from "react";
import {Dimensions, Image, ScrollView, Text, View, StyleSheet} from "react-native";
import {BASE_URL} from "../config";
import Carousel from 'react-native-snap-carousel';

const {width} = Dimensions.get("window");
const height = width * 0.8;

export default class ImageCarousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 0
        }

        this.change = this.change.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    change(index) {
        if(index !== this.state.active) {
            this.setState({active: index})
        }
    }

    _renderItem({item,index}) {
        const {profileName} = this.props;
        return (
            <Image
                key={index}
                style={style.image}
                source={{uri: BASE_URL+'/assets/images/posts/'+profileName.toLowerCase()+'/'+item}}
            />
        )
    }

    render() {
        const {images} = this.props;
        const {active} = this.state;
        return (
            <>
                {images &&
                    <>
                    <Carousel
                        layout={'stack'}
                        data={images}
                        onSnapToItem={this.change}
                        enableSnap={true}
                        renderItem={this._renderItem}
                        sliderWidth={357}
                        itemWidth={357}
                    />
                        <View style={style.pagination}>
                            {images.length > 1 && images.map((i,index) => (
                                <Text
                                    key={index}
                                    style={index == active ? style.paginationActiveText : style.paginationText}>
                                    ⬤
                                </Text>
                            ))}
                        </View>
                    </>
                }
            </>
        )
    }
}

const style = StyleSheet.create({
    image: {width: '100%', height: 350,resizeMode: 'cover'},
    pagination: {flex:1,flexDirection: 'row',position: 'absolute', bottom: 35, alignSelf: 'center'},
    paginationText: {fontSize: (width/20),color: '#c3c3c3', margin: 3},
    paginationActiveText: {fontSize: (width/20),color: '#f00', margin: 3}
})