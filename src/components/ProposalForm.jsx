// src/components/ProposalForm.jsx

import React, { useState } from 'react';
import './ProposalForm.css'; // 我们将为这个组件创建专门的样式文件

function ProposalForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); 
    // 【已修改】检查内容是否为空，如果为空，则使用标题作为提交内容
    const submissionContent = content.trim() === '' ? title : content;

    // 增加一个判断，确保至少标题或内容有一个被填写
    if (submissionContent.trim() === '') {
      alert('請至少填寫標題或內容！'); // 提示用户
      return; // 阻止提交
    }

    onSubmit(submissionContent);
  };

  return (
    <div className="proposal-container">
      <div className="header-title">
        <h1>議案提出 (PROPOSAL SUBMISSION)</h1>
        <p>// MAGI SYSTEM // DECISION REQUEST FORM</p>
      </div>
      
      <form className="proposal-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">TITLE:</label>
          <input 
            id="title" 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">CONTENT:</label>
          <textarea 
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
          />
        </div>
        <div className="form-group">
          <label htmlFor="submitter">SUBMITTER:</label>
          <input 
            id="submitter" 
            type="text" 
            defaultValue="USER-01" 
          />
        </div>
        <button type="submit" className="submit-button">[ SUBMIT ]</button>
      </form>
    </div>
  );
}

export default ProposalForm;