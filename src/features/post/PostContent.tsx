import { StackNavigationProp } from "@react-navigation/stack"
import React, { useEffect, useState } from "react"
import {
    StyleSheet,
    SafeAreaView,
    Text,
    View,
    TextInput,
    FlatList
} from "react-native"
import { useSelector } from "react-redux"

import { RootStoreType } from "../../redux/rootReducer"
import { RootStackParamsList } from "../navigation/Navigator"
import { Comment } from "../../services/network/api/models"
import filter from "lodash.filter";

interface Props {
    navigation: StackNavigationProp<RootStackParamsList, "PostContent">
}

const PostContent = ({ }: Props) => {
    const post = useSelector((state: RootStoreType) => state.post.specificPost)
    const comments = useSelector((state: RootStoreType) => state.post.comments)

    const [commentList, setCommentList] = useState<Array<Comment>>(comments)
    const [seachText, setSearchText] = useState('')

    useEffect(() => {
        if (seachText == '') {
            setCommentList(comments)
        }
    }, [comments])

    const search = (value: string) => {
        const formattedQuery = value.toLowerCase();
        const filteredData = filter(comments, comment => {
            return contains(comment, formattedQuery);
        });

        setSearchText(formattedQuery)
        setCommentList(filteredData)
    }

    const isInclude = (realText: string, query: string) => {
        return realText.toLowerCase().includes(query)
    }

    const contains = (comment: Comment, query: string) => {
        const { name, email, body } = comment;
      
        if (isInclude(name, query) || isInclude(email, query) || isInclude(body, query)) {
          return true;
        }
        return false;
      };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ padding: 20 }}>
                {
                    post != null &&
                    <View>
                        <Text style={styles.title}>{post.title}</Text>
                        <Text>{post!.body}</Text>
                    </View>
                }

                <View style={styles.commentText}>
                    <Text style={{ color: 'white' }}>Comments</Text>
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <View style={styles.searchBoxContainer}>
                    <View style={styles.searchBox}>
                        <TextInput style={styles.searchBar}
                            autoCapitalize="none"
                            autoCorrect={false}
                            clearButtonMode="always"
                            placeholder={"Search Comments"}
                            onChangeText={(value) => search(value)}
                        />
                    </View>
                </View>

                {
                    comments != undefined &&
                    <FlatList
                        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                        data={commentList}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.postContainer}>
                                <Text style={styles.title}>{item.name}</Text>
                                <Text style={styles.smallText}>{item.email}</Text>

                                <View style={styles.divider} />

                                <Text style={styles.commentBody}>{item.body}</Text>
                            </View>
                        )}
                    />
                }
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    commentText: {
        marginTop: 20,
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'grey'
    },
    searchBoxContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'grey'
    },
    searchBox: {
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'grey'
    },
    searchBar: {
        width: "100%",
        color: 'grey'
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
    divider: {
        width: '100%',
        borderWidth: 0.5,
        borderColor: "#000",
        marginVertical: 10
    },
    title: {
        fontWeight: 'bold'
    },
    smallText: {
        fontSize: 10,
        color: 'grey'
    },
    commentBody: {
        color: 'grey'
    }
})

export default PostContent
