import { StackNavigationProp } from "@react-navigation/stack"
import React, { useEffect } from "react"
import {
    ActivityIndicator,
    Button,
    SafeAreaView,
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    FlatList,
} from "react-native"
import { useDispatch, useSelector } from "react-redux"
import useSwr from "swr"
import Space from "../../common/components/abstract/Space"
import { base64Util } from "../../common/helpers/base64Util"
import { RootStoreType } from "../../redux/rootReducer"
import { postActions } from "../../redux/slices/postSlice"
import { navigationService } from "../../services/navigation/navigationService"
import { ApiService } from "../../services/network/api/apiService"
import { Post } from "../../services/network/api/models"
import LoadingPopup from "../../common/components/LoadingPopup"
import { RootStackParamsList } from "../navigation/Navigator"

interface Props {
    navigation: StackNavigationProp<RootStackParamsList, "Home">
}

const Home = ({ }: Props) => {

    const dispatch = useDispatch()
    const posts = useSelector((state: RootStoreType) => state.post.posts)
    const loading = useSelector((state: RootStoreType) => state.post.loading)

    useEffect(() => {
        getAllPosts()
    }, [])

    const getAllPosts = async () => {
        return await dispatch(postActions.getAllPosts())
    }

    const viewPost = async (postID: number) => {
        await dispatch(postActions.getPost(postID))
        await dispatch(postActions.getComments(postID))
    }

    return (
        <SafeAreaView style={styles.container}>
            <LoadingPopup visible={loading} />
               
            {
                posts != undefined &&
                <FlatList
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                    data={posts}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.postContainer} onPress={() => viewPost(item.id)}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text>{item.body}</Text>
                        </TouchableOpacity>
                    )}
                />
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    postContainer: {
        backgroundColor: 'white',
        marginTop: 20,
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    title: {
        fontWeight: 'bold'
    }
})

export default Home
