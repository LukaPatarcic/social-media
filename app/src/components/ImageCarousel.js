import React, {Component} from "react";
import {Dimensions, Image, ScrollView, Text, View, StyleSheet} from "react-native";
import {BASE_URL} from "../config";

const {width} = Dimensions.get("window");
const height = width * 0.8;

export default class ImageCarousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 0
        }

        this.change = this.change.bind(this);
    }

    change({nativeEvent}) {
        const  slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        if(slide !== this.state.active) {
            this.setState({active: slide})
        }
    }

    render() {
        const {images,profileName} = this.props;
        return (
            images &&
                <View style={style.scrollView}>
                    <ScrollView
                        pagingEnabled={true}
                        horizontal={true}
                        onScroll={this.change}
                        showsHorizontalScrollIndicator={false}
                        style={style.scrollView}
                    >
                        {images.map((image,index) => (
                            <View key={index}>
                                <Image
                                    style={style.image}
                                    source={{uri: BASE_URL+'/assets/images/posts/'+profileName.toLowerCase()+'/'+image}}
                                />
                            </View>
                        ))}
                    </ScrollView>
                    <View style={style.pagination}>
                        {images.length > 1 && images.map((i,index) => (
                            <Text
                                key={index}
                                style={index == this.state.active ? style.paginationActiveText : style.paginationText}>
                                ⬤
                            </Text>
                        ))}
                    </View>
                </View>
        )
    }
}

const style = StyleSheet.create({
    container: {width,height},
    scrollView: {width,height},
    image: {width: width, height: height,resizeMode: 'cover'},
    pagination: {flexDirection: 'row',position: 'absolute', bottom: 0, alignSelf: 'center'},
    paginationText: {fontSize: (width/20),color: '#888', margin: 3},
    paginationActiveText: {fontSize: (width/20),color: '#fff', margin: 3}


})