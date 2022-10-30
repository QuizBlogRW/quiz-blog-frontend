import React, { useState, useEffect, useCallback } from 'react'
// import { Page, Text, View, Document, Image, Link, StyleSheet } from "@react-pdf/renderer"
import SpinningBubbles from '../rLoading/SpinningBubbles'

// const styles = StyleSheet.create({
//     page: {
//         backgroundColor: "#f6f6f5",
//         padding: 10
//     },
//     reviewHeader: {
//         width: "100%",
//         padding: 10,
//         display: "flex",
//         justifyContent: "space-around",
//         flexDirection: "row",
//         backgroundColor: "#157a6e"
//     },
//     reviewHeaderImage: {
//         height: 38,
//         width: 90
//     },
//     reviewHeaderContact: {
//         color: "white",
//         fontSize: 11
//     },
//     reviewTitle: {
//         textAlign: "center",
//         textTransform: "uppercase",
//         color: "#6c757d",
//         margin: 10
//     },
//     reviewContainer: {
//         backgroundColor: "#ffffff",
//         padding: 5
//     },
//     questionText: {
//         fontSize: 13,
//         marginBottom: 10,
//         fontWeight: "900"
//     },
//     reviewImage: {
//         width: 100,
//         margin: "10px 30px",
//     }

// })

const PdfDocument = ({ review }) => {

    const [imgLoaded, setImgLoaded] = useState(false)
    const onLoad = useCallback(() => { setImgLoaded(true) }, [])
    useEffect(() => { onLoad() }, [onLoad])

    return (
        imgLoaded ?
            // <Document>
            //     <Page style={styles.page}>

            //         <View style={styles.reviewHeader}>
            //             <Image source="https://quizblogbucket.s3.us-east-2.amazonaws.com/quizLogo.jpg" style={styles.reviewHeaderImage} />
            //             <View style={styles.reviewHeaderContact}>

            //                 <Text>
            //                     <Text style={{ color: "#ffffff" }}>
            //                         Website:</Text>
            //                     <Link src="https://www.quizblog.rw" style={{ color: "#ffc107", textDecoration: "none" }}> https://www.quizblog.rw</Link>
            //                 </Text>
            //                 <Text>
            //                     <Text style={{ color: "#ffffff" }}>
            //                         Email:</Text>
            //                     <Link src="quizblog.rw@gmail.com" style={{ color: "#ffc107", textDecoration: "none" }}> quizblog.rw@gmail.com</Link>
            //                 </Text>
            //                 <Text style={{ color: "#ffc107" }}>
            //                     <Text style={{ color: "#ffffff" }}>Phone:</Text> 0780579067
            //                 </Text>

            //             </View>
            //         </View>

            //         <View>
            //             <Text style={styles.reviewTitle}>{review.title}</Text>
            //         </View>

            //         {review ?
            //             review.questions.map((question, index) => {
            //                 return (
            //                     <View key={index} style={styles.reviewContainer}>

            //                         <Text style={styles.questionText}>Q{index + 1}. {question.questionText}</Text>

            //                         {/* Image */}
            //                         {question && question.question_image ?
            //                             <View style={{ display: 'block' }}>
            //                                 <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '10px' }}>
            //                                     <Image src={{ uri: question.question_image, method: "GET", headers: { "Cache-Control": "no-cache" }, body: "" }} style={styles.reviewImage} onLoad={onLoad} />

            //                                 </View>
            //                             </View> : null}

            //                         {question.answerOptions.map((answer, index) =>
            //                             <View key={index} style={{
            //                                 fontSize: 12,
            //                                 marginBottom: 12,
            //                                 color: answer.isCorrect ? "#b99e03" : !answer.isCorrect && answer.choosen ? "red" : "#6c757d"
            //                             }}>
            //                                 <View key={index}>
            //                                     <Text>{index + 1}. {answer.answerText}</Text>
            //                                     {answer.explanations ?
            //                                         <Text style={{ fontSize: "9px", marginTop: 6 }}>{answer.explanations}</Text> : null}
            //                                 </View>
            //                             </View>
            //                         )}
            //                     </View>
            //                 )
            //             })
            //             : ""}
            //     </Page>
            // </Document> 
            <p>Not available</p>

            : <SpinningBubbles title='question' />)
}

export default PdfDocument