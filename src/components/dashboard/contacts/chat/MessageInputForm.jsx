import { Form, FormGroup, Input, Button } from 'reactstrap';

const MAX_MESSAGE_LENGTH = 1000;

const MessageForm = ({ textareaRef, messageContent, setMessageContent, sendChatMessage, handleTyping, isLoading, showAllChats }) => {
  return (
    showAllChats ? null :
      <div className="border-top pt-3">
        <Form onSubmit={sendChatMessage}>
          <FormGroup className="mb-2">
            <Input
              innerRef={textareaRef}
              type="textarea"
              name="message_content"
              placeholder="Type your message... (Ctrl+Enter to send)"
              rows="3"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyDown={handleTyping}
              disabled={isLoading}
              maxLength={MAX_MESSAGE_LENGTH}
              aria-label="Message input"
            />
            <small className="text-muted mt-1">
              {messageContent.length}/{MAX_MESSAGE_LENGTH}
            </small>
          </FormGroup>

          <Button
            type="submit"
            className="w-100 text-white"
            style={{ backgroundColor: 'var(--brand)' }}
            disabled={!messageContent.trim() || isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </Button>
        </Form>
      </div>
  )
}

export default MessageForm