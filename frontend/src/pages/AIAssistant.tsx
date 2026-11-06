import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Layers,
  ChevronRight,
  ExternalLink,
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { ChatResponse, Citation } from '../types';
import { useApp } from '../context/AppContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  engine?: string;
  confidence?: number;
  evidence_quality?: string;
  suggested_followups?: string[];
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  "What happens if Supplier A delays Component C-101 by five days?",
  "Which customer orders are affected by this disruption?",
  "Do we have enough inventory to cover the delay?",
  "What recovery options are available?",
  "Explain the risk associated with Supplier A.",
  "Which suppliers currently have high-risk shipments?"
];

export const AIAssistant: React.FC = () => {
  const { scenarioActive } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      content: (
        "Welcome to **SupplyChain Intelligence Assistant**. I am connected directly to your operational records, contracts, shipments, and inventory databases.\n\n" +
        "I am currently tracking active Incident **INC-2024-001** (Supplier A delay on Component C-101). Select one of the suggested inquiries below or enter any supply chain query."
      ),
      engine: "Deterministic Scenario-Aware Fallback Engine",
      confidence: 0.98,
      evidence_quality: "High — Verified against Master Supply Agreement, Warehouse Audits, and Carrier Records",
      citations: [
        {
          doc_id: "DOC-INC-2024-001",
          title: "Disruption Investigation Report INC-2024-001",
          type: "Incident Report",
          category: "Risk Management",
          date: "2026-11-06",
          relevance_excerpt: "Supplier A notified of 5-day delay on shipment SHP-801 due to wire-bonding test variation at Hsinchu packaging facility..."
        },
        {
          doc_id: "DOC-SUP-A-CONTRACT",
          title: "Master Supply Agreement (MSA-2023-A) — Apex Microelectronics",
          type: "Contract",
          category: "Legal & SLA",
          date: "2023-01-15",
          relevance_excerpt: "Section 8.4 Delivery Delays: Buyer reserves right to require expedited air freight at Supplier's sole expense..."
        }
      ],
      timestamp: "Just now"
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [documentCollection, setDocumentCollection] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getDocuments().then(setDocumentCollection).catch(console.error);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText: string) => {
    if (!queryText.trim() || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const response: ChatResponse = await api.askAssistant(queryText);
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: response.answer,
        citations: response.citations,
        engine: response.engine,
        confidence: response.confidence,
        evidence_quality: response.evidence_quality,
        suggested_followups: response.suggested_followups,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat query failed:', err);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        content: "An operational query error occurred. Please verify backend connectivity.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Basic markdown bold/bullet formatter
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      // Bold handling
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formattedLine = formattedLine.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-[#ED6A24] px-1 py-0.5 rounded font-mono text-[11px]">$1</code>');

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <li
            key={idx}
            className="ml-4 list-disc text-xs text-[#333] leading-relaxed my-0.5"
            dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^[•-]\s*/, '') }}
          />
        );
      }
      if (line.match(/^\d+\.\s/)) {
        return (
          <div
            key={idx}
            className="ml-2 text-xs text-[#333] leading-relaxed my-0.5"
            dangerouslySetInnerHTML={{ __html: formattedLine }}
          />
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p
          key={idx}
          className="text-xs text-[#333] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#171717] tracking-tight">SupplyChain Intelligence Assistant</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-[#FFF5F0] text-[#ED6A24] font-bold rounded border border-[#FDBA74]/50 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Grounded RAG
            </span>
          </div>
          <p className="text-xs text-[#686868] mt-0.5">
            Ask questions about suppliers, shipments, inventory, disruptions, and operational risks.
          </p>
        </div>

        {/* Engine mode badge */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#888]">Knowledge Base:</span>
          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[#333] font-semibold">
            {documentCollection.length} Grounded Enterprise Documents
          </span>
        </div>
      </div>

      {/* Main Container: Chat on Left, RAG Document Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Chat Conversation Column */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#E5E5E5] flex flex-col h-[700px] shadow-xs">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#171717] text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    <Bot className="w-4 h-4 text-[#ED6A24]" />
                  </div>
                )}

                <div className={`max-w-[85%] rounded-lg p-3.5 space-y-2 text-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#171717] text-white ml-12'
                    : 'bg-[#FAFAFA] border border-[#E5E5E5] text-[#171717]'
                }`}>
                  {/* Content */}
                  <div>{renderFormattedText(msg.content)}</div>

                  {/* Assistant Telemetry & Grounded Citations */}
                  {msg.sender === 'assistant' && msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2.5 mt-2 border-t border-[#EFEFEF] space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-[#888]">
                        <span className="flex items-center gap-1 font-semibold text-[#555]">
                          <BookOpen className="w-3 h-3 text-[#ED6A24]" />
                          Verified Grounded Sources ({msg.citations.length})
                        </span>
                        {msg.confidence && (
                          <span className="font-mono text-green-700 font-semibold">
                            Confidence: {(msg.confidence * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>

                      {/* Citation Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {msg.citations.map((cite) => (
                          <button
                            key={cite.doc_id}
                            onClick={() => setSelectedCitation(cite)}
                            className="text-left text-[11px] px-2 py-1 bg-white hover:bg-gray-100 border border-[#E0E0E0] rounded font-mono text-[#444] transition-colors flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3 text-[#ED6A24]" />
                            <span className="font-bold text-[#171717]">{cite.doc_id}</span>
                            <span className="text-[#888] truncate max-w-[120px]">({cite.title.split('—')[0]})</span>
                          </button>
                        ))}
                      </div>

                      {/* Engine Tag */}
                      {msg.engine && (
                        <div className="text-[10px] text-[#888] font-mono flex items-center gap-1 pt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span>Generated by: {msg.engine}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`text-[10px] font-mono text-right ${msg.sender === 'user' ? 'text-gray-400' : 'text-[#888]'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-full bg-[#171717] text-white flex items-center justify-center shrink-0 text-xs">
                  <Bot className="w-4 h-4 text-[#ED6A24] animate-spin" />
                </div>
                <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-3 text-xs text-[#686868] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ED6A24] animate-ping" />
                  <span>Retrieving grounded operational evidence and generating response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Pills */}
          <div className="px-4 py-2 border-t border-[#EFEFEF] bg-[#FDFDFD]">
            <div className="text-[10px] font-bold text-[#888] uppercase tracking-wider mb-1.5">
              Suggested Inquiries:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="px-2 py-1 bg-white hover:bg-gray-100 border border-[#E5E5E5] rounded text-[11px] text-[#555] hover:text-[#171717] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Query Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputQuery);
            }}
            className="p-3 border-t border-[#E5E5E5] bg-white flex items-center gap-2 rounded-b-xl"
          >
            <input
              type="text"
              placeholder="Ask anything about suppliers, C-101 delay, customer order exposure, or recovery plans..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={loading}
              className="flex-1 px-3.5 py-2 bg-[#F9FAFB] border border-[#E5E5E5] rounded-md text-xs placeholder-[#888] focus:outline-none focus:border-[#ED6A24] focus:bg-white"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="px-3.5 py-2 bg-[#ED6A24] hover:bg-[#D85A18] disabled:opacity-50 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Right Column: RAG Source Document Inspector */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#E5E5E5] p-5 space-y-4 shadow-xs sticky top-20">
          <div className="pb-3 border-b border-[#E5E5E5]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#ED6A24]" />
              <h2 className="text-sm font-bold text-[#171717]">Document Repository & Citation Inspector</h2>
            </div>
            <p className="text-xs text-[#686868] mt-0.5">
              Verified ground-truth documents indexed in the vector/keyword store.
            </p>
          </div>

          {/* Active Citation Detail if clicked */}
          {selectedCitation ? (
            <div className="p-3.5 bg-orange-50/50 border border-orange-200 rounded-lg space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-orange-900 bg-orange-100 px-1.5 py-0.5 rounded text-[10px]">
                  {selectedCitation.doc_id}
                </span>
                <span className="text-[10px] text-[#666] font-mono">{selectedCitation.date}</span>
              </div>
              <h3 className="font-bold text-[#171717]">{selectedCitation.title}</h3>
              <div className="text-[10px] text-[#888] uppercase font-mono">{selectedCitation.category} • {selectedCitation.type}</div>
              <p className="text-[11px] text-[#333] leading-relaxed bg-white p-2.5 rounded border border-orange-100">
                "{selectedCitation.relevance_excerpt}"
              </p>
              <button
                onClick={() => setSelectedCitation(null)}
                className="text-[11px] text-[#ED6A24] font-semibold hover:underline block pt-1"
              >
                Close document view
              </button>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-[#666]">
              Click any citation badge in the conversation to inspect the underlying verified source document.
            </div>
          )}

          {/* List of Indexed Documents */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#171717] uppercase tracking-wider text-[#888]">
              Indexed System Documents ({documentCollection.length})
            </h3>
            <div className="space-y-1.5 text-xs max-h-[420px] overflow-y-auto pr-1">
              {documentCollection.map((doc) => (
                <div
                  key={doc.doc_id}
                  onClick={() => setSelectedCitation({
                    doc_id: doc.doc_id,
                    title: doc.title,
                    type: doc.type,
                    category: doc.category,
                    date: doc.date,
                    relevance_excerpt: doc.excerpt
                  })}
                  className="p-2.5 border border-[#E5E5E5] hover:border-gray-400 rounded-lg cursor-pointer transition-colors bg-white hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between text-[10px] text-[#888] font-mono mb-0.5">
                    <span className="font-bold text-[#171717]">{doc.doc_id}</span>
                    <span>{doc.type}</span>
                  </div>
                  <div className="font-semibold text-xs text-[#171717] truncate">{doc.title}</div>
                  <p className="text-[11px] text-[#666] line-clamp-2 mt-1">{doc.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
