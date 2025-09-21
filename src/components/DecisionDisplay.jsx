// src/components/DecisionDisplay.jsx

import React, { useState, useEffect } from 'react';
import './DecisionDisplay.css';

// 【已修改】
const MagiModel = ({ name, number, status }) => {
  // 自动将模型名称转换为小写，并作为唯一的类名
  const specificClass = `model-${name.toLowerCase()}`;
  const statusClass = `magi-model ${status} ${specificClass}`;
  
  return (
    <div className={statusClass}>
      <span className="model-name">{name}</span>
      <span className="model-number">{number}</span>
    </div>
  );
};

// 【已修改】接收 isLoading prop
function DecisionDisplay({ decisionData, isLoading }) {
  const [modelStatuses, setModelStatuses] = useState({
    melchior: 'pending',
    balthasar: 'pending',
    casper: 'pending',
  });
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // 只有在加载结束并且有数据的时候，才启动结果动画
    if (!isLoading && decisionData) {
      const { results } = decisionData;
      // 健壮性检查，防止results为空
      if (results && results.length >= 3) {
        const melchiorResult = results[0].decision === 1 ? 'approved' : 'rejected';
        const balthasarResult = results[1].decision === 1 ? 'approved' : 'rejected';
        const casperResult = results[2].decision === 1 ? 'approved' : 'rejected';
        
        setTimeout(() => setModelStatuses(prev => ({ ...prev, melchior: melchiorResult })), 500);
        setTimeout(() => setModelStatuses(prev => ({ ...prev, balthasar: balthasarResult })), 1000);
        setTimeout(() => setModelStatuses(prev => ({ ...prev, casper: casperResult })), 1500);
        setTimeout(() => setShowResults(true), 2000);
      } else {
        // 如果数据格式不正确（例如错误信息），直接显示结果
        setShowResults(true);
      }
    } else if (isLoading) {
      // 如果正在加载，重置所有状态为初始的“审议中”
      setModelStatuses({ melchior: 'pending', balthasar: 'pending', casper: 'pending' });
      setShowResults(false);
    }
  }, [decisionData, isLoading]);

  const finalDecisionText = decisionData ? decisionData.finalDecision : '審議中...';

  return (
    <div className="decision-container">
      <div className="info-grid">
        <div className="info-left">
          <p>提訴 (PROPOSAL)</p>
          <p>CODE: 132</p>
          <p>FILE: MAGI_SYS</p>
          <p>EXTENTION: 2048</p>
        </div>
        <div className="info-right">
          <p>決議 (RESOLUTION)</p>
          <div className={`final-decision-box ${showResults ? (finalDecisionText === 'APPROVED' ? 'approved' : 'rejected') : ''}`}>
            {
              showResults 
                ? (finalDecisionText === 'APPROVED' ? `通過 (${finalDecisionText})` : `否決 (${finalDecisionText})`)
                : '審議中...'
            }
          </div>
        </div>
      </div>

      <div className="magi-core">
        <div className="magi-center-text">MAGI</div>
        
        {/* 【最终版本】修正容器后的SVG画布 */}
          <svg className="connector-lines" width="100%" height="100%">
          {/* 
            坐标计算 (基于400px高的容器和150px宽的矩形):
            - Balthasar(2) 宽度占容器约15%，一半是7.5%。其底部边角 x 坐标约为 50% ± 7.5%。y 坐标为 10px(top)+120px(height) = 130px。
            - Casper(3)/Melchior(1) 顶部 y 坐标为 400px - 60px(bottom) - 120px(height) = 220px。
            - Casper(3) 右边缘 x 坐标为 20%(left) + 15%(width) = 35%。
            - Melchior(1) 左边缘 x 坐标为 100% - 20%(right) - 15%(width) = 65%。
            - 它们的垂直中点 y 坐标为 220px(top) + 60px(半高) = 280px。
          */}
          
          {/* 线条 1: Balthasar(右下角) 连接到 Melchior(左上角) */}
          <line x1="57.5%" y1="130" x2="65%" y2="220" />
          
          {/* 线条 2: Balthasar(左下角) 连接到 Casper(右上角) */}
          <line x1="42.5%" y1="130" x2="35%" y2="220" />

          {/* 线条 3: Casper(右中点) 水平连接到 Melchior(左中点) */}
          <line x1="35%" y1="280" x2="65%" y2="280" />
        </svg>
        
        <MagiModel name="BALTHASAR" number="2" status={modelStatuses.balthasar} />
        <MagiModel name="CASPER" number="3" status={modelStatuses.casper} />
        <MagiModel name="MELCHIOR" number="1" status={modelStatuses.melchior} />
      </div>

      {showResults && decisionData && (
        <div className="analysis-section">
          {decisionData.results.map((result, index) => (
            <div className="analysis-report" key={index}>
              <h3>{result.model}: ANALYSIS</h3>
              <p>{result.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DecisionDisplay;