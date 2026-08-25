import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Form, Spinner, Badge } from 'react-bootstrap';
import { Bot, X, Send, Sparkles, User, RefreshCw } from 'lucide-react';
import API from '../services/api';

const AIChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: '👋 Xin chào! Tôi là Trợ lý AI EduSmart. Bạn đang cần tìm khóa học lập trình gì (Node.js, ReactJS, MongoDB...)?'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (customText = null) => {
    const textToSend = customText || inputMsg;
    if (!textToSend || !textToSend.trim() || loading) return;

    const trimmedText = textToSend.trim();
    const userMessage = { role: 'user', content: trimmedText };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInputMsg('');
    setLoading(true);

    try {
      // Send chat request to backend Gemini AI Chat Endpoint
      const res = await API.post('/ai/chat', {
        history: updatedMessages.slice(-6),
        message: trimmedText
      });

      if (res.data && res.data.success) {
        const replyText = res.data.data.reply;
        setMessages([...updatedMessages, { role: 'model', content: replyText }]);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('[AIChatBubble]: Chat error:', error);

      // Local fallback response so chat ALWAYS works even if backend is restarting
      let fallbackReply = '💡 Tôi có thể giúp gì cho bạn về các khóa học Node.js, ReactJS, MongoDB, ExpressJS hoặc định hướng IT nhé!';
      const lower = trimmedText.toLowerCase();

      if (lower.includes('node') || lower.includes('backend') || lower.includes('express')) {
        fallbackReply = '🚀 Để học Backend, bạn nên chọn khóa "NodeJS Backend từ cơ bản đến nâng cao" hoặc "Fullstack JavaScript MERN Stack". Khóa học dạy xây dựng RESTful API chuyên nghiệp!';
      } else if (lower.includes('react') || lower.includes('front')) {
        fallbackReply = '⚡ Với Frontend ReactJS, khóa "ReactJS cơ bản và ứng dụng thực tế" hướng dẫn React Hooks, Redux Toolkit và làm ứng dụng SPA chuẩn doanh nghiệp.';
      } else if (lower.includes('giá') || lower.includes('miễn phí') || lower.includes('rẻ')) {
        fallbackReply = '💰 Khóa học trên hệ thống có mức giá linh hoạt từ Miễn phí đến các khóa nâng cao. Bạn có thể xem chi tiết ở mục "Tìm kiếm khóa học" nhé!';
      } else if (lower.includes('chào') || lower.includes('hi') || lower.includes('hello')) {
        fallbackReply = '👋 Xin chào bạn! Rất vui được tư vấn lộ trình học lập trình cho bạn!';
      }

      setMessages([...updatedMessages, { role: 'model', content: fallbackReply }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: 'model',
        content: '👋 Đã khởi tạo lại cuộc trò chuyện. Tôi có thể giúp gì cho bạn?'
      }
    ]);
  };

  const quickPrompts = [
    '⚡ Khóa học Node.js Backend',
    '🚀 Lộ trình học ReactJS',
    '💰 Các khóa học giá rẻ nhất'
  ];

  return (
    <div className="position-fixed bottom-0 end-0 m-4" style={{ zIndex: 9999 }}>
      {/* Floating Chat Window */}
      {isOpen ? (
        <Card className="border-0 shadow-lg rounded-4 overflow-hidden" style={{ width: '380px', height: '540px' }}>
          {/* Header */}
          <Card.Header className="bg-dark text-white p-3 d-flex align-items-center justify-content-between border-0">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary text-white p-2 rounded-circle d-flex align-items-center justify-content-center shadow-sm">
                <Bot size={22} />
              </div>
              <div>
                <h6 className="fw-bold mb-0 text-white d-flex align-items-center gap-1 fs-6">
                  Trợ Lý AI EduSmart
                  <Badge bg="success" className="ms-1 extra-small">AI Chat</Badge>
                </h6>
                <span className="extra-small text-white-50">Tư vấn khóa học & Lộ trình 24/7</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-1">
              <Button
                variant="link"
                size="sm"
                className="text-white-50 p-1 hover-light"
                onClick={handleClearHistory}
                title="Làm mới cuộc trò chuyện"
              >
                <RefreshCw size={16} />
              </Button>
              <Button
                variant="link"
                size="sm"
                className="text-white p-1 hover-light"
                onClick={() => setIsOpen(false)}
                title="Đóng chat"
              >
                <X size={22} />
              </Button>
            </div>
          </Card.Header>

          {/* Messages Chat Area */}
          <Card.Body className="p-3 bg-light overflow-auto d-flex flex-column" style={{ height: '350px' }}>
            <div className="d-flex flex-column gap-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`d-flex align-items-start gap-2 ${
                    msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'
                  }`}
                >
                  {msg.role === 'model' && (
                    <div className="bg-primary text-white p-1 rounded-circle flex-shrink-0 mt-1 shadow-sm">
                      <Bot size={14} />
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-4 small ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-top-right-0 shadow-sm'
                        : 'bg-white text-dark shadow-sm border rounded-top-left-0'
                    }`}
                    style={{ maxWidth: '82%', whiteSpace: 'pre-line', lineHeight: '1.5', fontSize: '0.875rem' }}
                  >
                    {msg.content}
                  </div>

                  {msg.role === 'user' && (
                    <div className="bg-secondary text-white p-1 rounded-circle flex-shrink-0 mt-1 shadow-sm">
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="d-flex align-items-center gap-2 text-muted small bg-white p-2 px-3 rounded-4 shadow-sm border align-self-start">
                  <Spinner animation="grow" size="sm" variant="primary" />
                  <span className="extra-small">AI đang trả lời...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </Card.Body>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-white border-top border-bottom d-flex gap-1 overflow-x-auto" style={{ whiteSpace: 'nowrap' }}>
            {quickPrompts.map((prompt, idx) => (
              <Button
                key={idx}
                variant="outline-primary"
                size="sm"
                className="py-1 px-2 extra-small rounded-pill text-nowrap flex-shrink-0"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>

          {/* Input Footer */}
          <Card.Footer className="bg-white p-2 border-0">
            <Form onSubmit={handleFormSubmit}>
              <div className="d-flex align-items-center gap-2">
                <Form.Control
                  type="text"
                  placeholder="Nhập câu hỏi cho AI..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  size="sm"
                  className="shadow-none border-0 bg-light rounded-pill px-3 py-2"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '36px', height: '36px' }}
                  disabled={!inputMsg.trim() || loading}
                >
                  <Send size={16} />
                </Button>
              </div>
            </Form>
          </Card.Footer>
        </Card>
      ) : (
        /* Floating Launcher Button */
        <Button
          variant="primary"
          onClick={() => setIsOpen(true)}
          className="rounded-circle shadow-lg p-3 d-flex align-items-center justify-content-center border-2 border-white position-relative"
          style={{ width: '62px', height: '62px', cursor: 'pointer' }}
          title="Mở Trợ lý AI Chat"
        >
          <Bot size={30} />
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light shadow-sm">
            <Sparkles size={10} /> AI
          </span>
        </Button>
      )}
    </div>
  );
};

export default AIChatBubble;
