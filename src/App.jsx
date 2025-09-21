// src/App.jsx

import React, { useState } from 'react';
import ProposalForm from './components/ProposalForm';
import DecisionDisplay from './components/DecisionDisplay'; 

function App() {
  const [decisionData, setDecisionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleProposalSubmit = async (proposalContent) => {
    setIsLoading(true); // 立刻进入加载状态
    setDecisionData(null); // 清空旧数据

    try {
      const response = await fetch('/decide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: proposalContent }),
      });
      const data = await response.json();
      setDecisionData(data); // 获取数据
    } catch (error) {
      console.error("調用決策API失敗:", error);
      // 设置一个错误对象，让DecisionDisplay可以显示错误信息
      setDecisionData({ 
          finalDecision: 'ERROR', 
          results: [
              { model: 'SYSTEM', explanation: '與後端服務器通信失敗，請檢查後端日誌或網絡連接。' }
          ] 
      });
    } finally {
      setIsLoading(false); // 无论成功或失败，API调用结束后就停止加载
    }
  };

  const resetToHome = () => {
    setDecisionData(null);
    setIsLoading(false);
  };
  
  // 渲染逻辑简化
  const renderContent = () => {
    // 如果有数据或正在加载，都显示DecisionDisplay
    if (decisionData || isLoading) {
      return <DecisionDisplay decisionData={decisionData} isLoading={isLoading} />;
    }
    // 否则显示表单
    return <ProposalForm onSubmit={handleProposalSubmit} />;
  };
  
  return (
    <div className="app-container">
      {renderContent()}
      
      {decisionData && (
        <button onClick={resetToHome} className="reset-button">
          [ 提出新議案 ]
        </button>
      )}
    </div>
  );
}

export default App;