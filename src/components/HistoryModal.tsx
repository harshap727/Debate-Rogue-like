import React, { useEffect, useState } from "react";
import { X, Shield, Award, Calendar, ExternalLink, Trash2 } from "lucide-react";
import { db, auth } from "../lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, user }) => {
  const [debates, setDebates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDebate, setSelectedDebate] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchUserHistory();
    }
  }, [isOpen, user]);

  const fetchUserHistory = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "debates"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      const items: any[] = [];
      querySnapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      items.sort((a, b) => {
        const tA = a.createdAt?.seconds || 0;
        const tB = b.createdAt?.seconds || 0;
        return tB - tA;
      });
      setDebates(items);
    } catch (err) {
      console.error("Error fetching debate history:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-mono">
      <div className="max-w-3xl w-full bg-[#13141C] border border-[#232530] shadow-2xl max-h-[85vh] flex flex-col relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#232530] bg-[#0B0B0F]">
          <div className="flex items-center gap-2 text-[#3B8EEA] font-bold uppercase tracking-wider text-sm">
            <Shield className="w-5 h-5" />
            <span>PLAYER DEBATE ARCHIVE // CLOUD HISTORY</span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-[#F4F4F6] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {!user ? (
            <div className="text-center py-12 space-y-3">
              <p className="text-sm text-zinc-400">Please sign in with Google to view and sync your debate archive.</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12 text-zinc-400 text-xs animate-pulse">
              LOADING ARCHIVED SIMULATION LOGS...
            </div>
          ) : debates.length === 0 ? (
            <div className="text-center py-12 space-y-2 border border-dashed border-[#232530] p-6">
              <p className="text-xs text-zinc-400">No completed debate runs found in your cloud archive.</p>
              <p className="text-[11px] text-zinc-600">Complete a debate match while signed in to record your logs here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {debates.map((item) => {
                const passedRounds = (item.history || []).filter((h: any) => (h.score || 0) >= 60 && (Number(h.scores?.evidence) || 0) >= 60).length;
                const isVictory = passedRounds >= 1 && (item.finalHealth || 0) > 0;
                return (
                  <div
                    key={item.id}
                    className="bg-[#0B0B0F] border border-[#232530] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 border font-bold uppercase ${
                          isVictory ? "bg-[#2ED573]/10 border-[#2ED573] text-[#2ED573]" : "bg-[#FF4B3E]/10 border-[#FF4B3E] text-[#FF4B3E]"
                        }`}>
                          {isVictory ? "VICTORY" : "DEFEAT"}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : "Recent Run"}
                        </span>
                        <span className="text-[10px] text-zinc-400 uppercase bg-[#13141C] px-1.5 py-0.5 border border-[#232530]">
                          {item.difficultyLevel || "NORMAL"}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-[#F4F4F6] font-sans">
                        {item.topic}
                      </h3>
                      <div className="text-[11px] text-zinc-400 flex flex-wrap gap-3 font-mono">
                        <span>Position: <strong className="text-zinc-200">{item.position}</strong></span>
                        <span>Opponent: <strong className="text-zinc-200">{item.opponent?.opponent || "Adversary"}</strong></span>
                        <span>Passed w/ Evidence: <strong className={passedRounds >= 1 ? "text-[#2ED573]" : "text-[#FF4B3E]"}>{passedRounds}/4 (Min 1 req)</strong></span>
                        <span>Health: <strong className="text-zinc-200">{item.finalHealth}/100</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedDebate(item)}
                      className="px-3 py-1.5 bg-[#13141C] hover:bg-[#3B8EEA] hover:text-black text-[#3B8EEA] border border-[#3B8EEA] text-xs font-bold uppercase transition-colors cursor-pointer shrink-0"
                    >
                      [ VIEW REPORT ]
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Debate Detail View Modal if selected */}
        {selectedDebate && (
          <div className="absolute inset-0 bg-[#13141C] z-20 flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#232530] pb-3 mb-4">
              <div>
                <div className="text-[10px] text-[#3B8EEA] font-bold uppercase">DETAILED MATCH REPORT</div>
                <h3 className="text-sm font-bold text-[#F4F4F6] font-sans">{selectedDebate.topic}</h3>
              </div>
              <button
                onClick={() => setSelectedDebate(null)}
                className="text-xs text-zinc-400 hover:text-white uppercase px-2 py-1 border border-[#232530] cursor-pointer"
              >
                [ BACK TO LIST ]
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans text-zinc-300">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-2.5 bg-[#0B0B0F] border border-[#232530]">
                  <div className="text-[10px] text-zinc-500 uppercase">SURVIVAL SCORE</div>
                  <div className="text-base font-bold text-[#F4F4F6]">{selectedDebate.evaluation?.survival || 0}%</div>
                </div>
                <div className="p-2.5 bg-[#0B0B0F] border border-[#232530]">
                  <div className="text-[10px] text-zinc-500 uppercase">LOGIC INDEX</div>
                  <div className="text-base font-bold text-[#3B8EEA]">{selectedDebate.evaluation?.logic || 0}%</div>
                </div>
                <div className="p-2.5 bg-[#0B0B0F] border border-[#232530]">
                  <div className="text-[10px] text-zinc-500 uppercase">EVIDENCE RATING</div>
                  <div className="text-base font-bold text-[#2ED573]">{selectedDebate.evaluation?.evidence || 0}%</div>
                </div>
                <div className="p-2.5 bg-[#0B0B0F] border border-[#232530]">
                  <div className="text-[10px] text-zinc-500 uppercase">ROUNDS PASSED</div>
                  <div className="text-base font-bold text-[#FFC93C]">
                    {(selectedDebate.history || []).filter((h: any) => (h.score || 0) >= 60 && (Number(h.scores?.evidence) || 0) >= 60).length} / 4
                  </div>
                </div>
              </div>

              <div className="space-y-2 font-mono">
                <h4 className="text-xs text-[#3B8EEA] uppercase font-bold">ROUND BY ROUND LOGS</h4>
                {(selectedDebate.history || []).map((h: any, idx: number) => (
                  <div key={idx} className="p-3 bg-[#0B0B0F] border border-[#232530] space-y-1.5 font-sans">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span className="font-bold text-[#F4F4F6]">ROUND {h.round}</span>
                      <span className={h.score >= 60 ? "text-[#2ED573]" : "text-[#FF4B3E]"}>Score: {h.score}/100</span>
                    </div>
                    <p className="text-xs text-zinc-300"><strong>User:</strong> {h.userArgument}</p>
                    <p className="text-xs text-zinc-400"><strong>Opponent:</strong> {h.opponentResponse}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
