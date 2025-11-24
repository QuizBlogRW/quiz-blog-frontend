import { Image, Text, View, Page, Document, StyleSheet } from '@react-pdf/renderer';
import '@/components/footer/footer.css';
import HeaderFooter from './HeaderFooter';

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#f6f6f5',
        padding: 20,
        fontFamily: 'Helvetica',
    },
    reviewHeader: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    reviewHeaderImage: {
        backgroundColor: '#fff',
        height: 100,
        width: 100,
        padding: 5,
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: 12,
        objectFit: 'cover',
    },
    reviewTitle: {
        textAlign: 'center',
        textTransform: 'uppercase',
        color: '#6c757d',
        fontSize: 16,
        fontWeight: 700,
        marginVertical: 10,
    },
    reviewContainer: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginVertical: 5,
        borderRadius: 8,
        border: '1px solid #dee2e6',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    questionText: {
        fontSize: 13,
        fontWeight: 700,
        marginBottom: 8,
        color: '#343a40',
    },
    reviewImage: {
        width: '100%',
        maxWidth: 260,
        marginVertical: 10,
        borderRadius: 8,
        alignSelf: 'center',
        objectFit: 'cover',
    },
    answerOption: {
        fontSize: 12,
        marginBottom: 8,
        paddingVertical: 3,
        paddingHorizontal: 6,
        borderRadius: 6,
    },
    explanationText: {
        fontSize: 9,
        marginTop: 4,
        color: '#495057',
    },
});

const PdfDocument = ({ review }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <HeaderFooter styles={styles} />

                <View
                    style={{
                        backgroundColor: 'khaki',
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        borderRadius: 8,
                        marginVertical: 10,
                    }}
                >
                    <Text style={styles.reviewTitle}>{review.title}</Text>
                </View>

                {review?.questions?.map((question, index) => (
                    <View key={index} style={styles.reviewContainer}>
                        <Text style={styles.questionText}>
                            Q{index + 1}. {question.questionText}
                        </Text>

                        {question.question_image && (
                            <Image
                                style={styles.reviewImage}
                                src={{
                                    uri: question.question_image,
                                    method: 'GET',
                                    headers: { 'Cache-Control': 'no-cache' },
                                    body: '',
                                }}
                            />
                        )}

                        {question.answerOptions?.map((option, idx) => {
                            let explanation = option.explanations || null;

                            // Convert links in explanation
                            if (explanation) {
                                const words = explanation.split(' ');
                                explanation = words.map((word) =>
                                    word.startsWith('http') ? (
                                        <Text key={word} style={{ color: '#0d6efd', textDecoration: 'underline' }}>
                                            {word}{' '}
                                        </Text>
                                    ) : (
                                        word + ' '
                                    )
                                );
                            }

                            const optionColor = option.isCorrect
                                ? '#28a745'
                                : !option.isCorrect && option.choosen
                                    ? '#dc3545'
                                    : '#6c757d';

                            return (
                                <View key={idx} style={{ ...styles.answerOption, backgroundColor: '#f8f9fa', color: optionColor }}>
                                    <Text>
                                        {idx + 1}. {option.answerText}
                                    </Text>
                                    {explanation && (
                                        <Text style={styles.explanationText}>Explanation: {explanation}</Text>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                ))}

                <HeaderFooter styles={styles} fromFooter />
            </Page>
        </Document>
    );
};

export default PdfDocument;
