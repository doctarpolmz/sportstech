const { v4: uuidv4 } = require('uuid');

// In-memory session storage (use Redis in production)
const sessions = new Map();

// Language translations
const translations = {
  en: {
    welcome: 'Welcome to ARIP\n1. Check Credit Score\n2. Apply for Loan\n3. View Insurance\n4. Climate Tips\n5. My Profile\n0. Exit',
    selectLanguage: 'Select Language:\n1. English\n2. Luganda\n3. Runyankole',
    enterPhone: 'Enter your phone number:',
    enterPin: 'Enter your 4-digit PIN:',
    invalidOption: 'Invalid option. Please try again.',
    thankYou: 'Thank you for using ARIP!'
  },
  lg: {
    welcome: 'Tukusanyukidde ku ARIP\n1. Laba Credit Score\n2. Saba Loan\n3. Laba Insurance\n4. Amagezi g\'obudde\n5. Profile yange\n0. Fuluma',
    selectLanguage: 'Londa Olulimi:\n1. English\n2. Luganda\n3. Runyankole',
    enterPhone: 'Wandiika number yo:',
    enterPin: 'Wandiika PIN yawo (4 digits):',
    invalidOption: 'Ekyasaliddwa si kituufu. Gezaako nate.',
    thankYou: 'Weebale okukozesa ARIP!'
  },
  rn: {
    welcome: 'Tukusiimye ARIP\n1. Raba Credit Score\n2. Saba Loan\n3. Raba Insurance\n4. Amagezi g\'ibihe\n5. Profile yanje\n0. Sohoka',
    selectLanguage: 'Hayo Rurimi:\n1. English\n2. Luganda\n3. Runyankole',
    enterPhone: 'Andika nomba yawe:',
    enterPin: 'Andika PIN yawe (4 digits):',
    invalidOption: 'Eky\'orondire tikiriho. Gerageza nate.',
    thankYou: 'Mwebaze kukozesa ARIP!'
  }
};

class USSDController {
  /**
   * Main USSD request handler
   * Follows Africa's Talking USSD format
   */
  handleUSSDRequest(req, res) {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    
    console.log('USSD Request:', { sessionId, serviceCode, phoneNumber, text });
    
    // Get or create session
    let session = sessions.get(sessionId) || {
      id: sessionId,
      phoneNumber,
      createdAt: new Date(),
      data: {},
      language: 'en',
      step: 'language'
    };
    
    sessions.set(sessionId, session);
    
    const textArray = text ? text.split('*') : [];
    const userInput = textArray[textArray.length - 1];
    
    let response = '';
    let continueSession = true;
    
    try {
      // Route to appropriate menu handler
      if (text === '') {
        // Initial request - show language selection
        response = this.showLanguageMenu(session);
      } else if (session.step === 'language') {
        response = this.handleLanguageSelection(session, userInput);
      } else if (session.step === 'main_menu') {
        response = this.handleMainMenu(session, userInput);
      } else if (session.step === 'credit_score') {
        response = this.handleCreditScoreMenu(session, userInput);
      } else if (session.step === 'loan_application') {
        response = this.handleLoanApplication(session, userInput);
      } else if (session.step === 'insurance') {
        response = this.handleInsurance(session, userInput);
      } else if (session.step === 'climate_tips') {
        response = this.handleClimateTips(session, userInput);
      } else if (session.step === 'profile') {
        response = this.handleProfile(session, userInput);
      } else {
        response = this.showMainMenu(session);
      }
      
      // Check if session should end
      if (userInput === '0' || session.shouldEnd) {
        continueSession = false;
        sessions.delete(sessionId);
      }
      
    } catch (error) {
      console.error('USSD Error:', error);
      response = 'END An error occurred. Please try again.';
      continueSession = false;
    }
    
    // Update session
    sessions.set(sessionId, session);
    
    // Send response
    const prefix = continueSession ? 'CON' : 'END';
    res.set('Content-Type', 'text/plain');
    res.send(`${prefix} ${response}`);
  }
  
  showLanguageMenu(session) {
    return translations.en.selectLanguage;
  }
  
  handleLanguageSelection(session, input) {
    const langMap = { '1': 'en', '2': 'lg', '3': 'rn' };
    session.language = langMap[input] || 'en';
    session.step = 'main_menu';
    return this.showMainMenu(session);
  }
  
  showMainMenu(session) {
    const t = translations[session.language];
    return t.welcome;
  }
  
  handleMainMenu(session, input) {
    const t = translations[session.language];
    
    switch(input) {
      case '1':
        session.step = 'credit_score';
        return this.showCreditScore(session);
      case '2':
        session.step = 'loan_application';
        return this.showLoanOptions(session);
      case '3':
        session.step = 'insurance';
        return this.showInsuranceOptions(session);
      case '4':
        session.step = 'climate_tips';
        return this.showClimateTips(session);
      case '5':
        session.step = 'profile';
        return this.showProfile(session);
      case '0':
        session.shouldEnd = true;
        return t.thankYou;
      default:
        return t.invalidOption + '\n\n' + t.welcome;
    }
  }
  
  showCreditScore(session) {
    // Mock credit score calculation
    const mockScore = Math.floor(Math.random() * 50) + 150; // 150-200
    const ariScore = Math.floor(Math.random() * 40) + 60;  // 60-100
    const frlScore = Math.floor(Math.random() * 40) + 60;  // 60-100
    const climateBonus = Math.floor(Math.random() * 20);    // 0-20
    
    if (session.language === 'en') {
      return `Your ARIP Credit Score:\n\nTotal Score: ${mockScore}/200\n- Agroclimatic Risk: ${ariScore}/100\n- Financial Repayment: ${frlScore}/100\n- Climate Bonus: +${climateBonus}\n\nStatus: ${mockScore >= 160 ? 'Excellent' : mockScore >= 140 ? 'Good' : 'Fair'}\n\n0. Back to Menu`;
    } else if (session.language === 'lg') {
      return `Credit Score yo:\n\nScore: ${mockScore}/200\n- Ebirime n\'obudde: ${ariScore}/100\n- Okusasula: ${frlScore}/100\n- Climate Bonus: +${climateBonus}\n\nStatus: ${mockScore >= 160 ? 'Nnungi nnyo' : mockScore >= 140 ? 'Nnungi' : 'Bulijjo'}\n\n0. Ddayo ku Menu`;
    } else {
      return `Credit Score yawe:\n\nScore: ${mockScore}/200\n- Ebirime n\'ibihe: ${ariScore}/100\n- Okusasura: ${frlScore}/100\n- Climate Bonus: +${climateBonus}\n\nStatus: ${mockScore >= 160 ? 'Nzaire' : mockScore >= 140 ? 'Nrungi' : 'Tali kibi'}\n\n0. Garuka ku Menu`;
    }
  }
  
  showLoanOptions(session) {
    if (session.language === 'en') {
      return `Loan Products:\n\n1. Input Loan (UGX 200k-1M)\n2. Equipment Loan (UGX 500k-5M)\n3. Climate-Smart Loan (UGX 100k-2M)\n4. Emergency Loan (UGX 50k-500k)\n\n0. Back to Menu`;
    } else if (session.language === 'lg') {
      return `Loans:\n\n1. Ya Bintu (200k-1M)\n2. Ya Byuma (500k-5M)\n3. Climate Loan (100k-2M)\n4. Emergency (50k-500k)\n\n0. Ddayo`;
    } else {
      return `Loans:\n\n1. Y'ebintu (200k-1M)\n2. Y'ebyuma (500k-5M)\n3. Climate Loan (100k-2M)\n4. Emergency (50k-500k)\n\n0. Garuka`;
    }
  }
  
  handleLoanApplication(session, input) {
    if (input === '0') {
      session.step = 'main_menu';
      return this.showMainMenu(session);
    }
    
    const loanTypes = ['Input Loan', 'Equipment Loan', 'Climate-Smart Loan', 'Emergency Loan'];
    const selectedLoan = loanTypes[parseInt(input) - 1];
    
    if (session.language === 'en') {
      return `${selectedLoan} application submitted!\n\nOur team will contact you within 24 hours.\n\nSMS confirmation sent to ${session.phoneNumber}\n\n0. Back to Menu`;
    } else if (session.language === 'lg') {
      return `${selectedLoan} esabiddwa!\n\nTunaakutuukirira mu saawa 24.\n\nSMS eweereddwa ${session.phoneNumber}\n\n0. Ddayo`;
    } else {
      return `${selectedLoan} esabiirwe!\n\nTurikuza mu saaha 24.\n\nSMS ehandikiirwe ${session.phoneNumber}\n\n0. Garuka`;
    }
  }
  
  showInsuranceOptions(session) {
    if (session.language === 'en') {
      return `Parametric Insurance:\n\n1. Drought Coverage (UGX 20k/acre/season)\n2. Flood Protection (UGX 25k/acre/season)\n3. Comprehensive (UGX 40k/acre/season)\n\nCurrent Status: ${Math.random() > 0.5 ? 'Enrolled' : 'Not Enrolled'}\n\n0. Back to Menu`;
    } else if (session.language === 'lg') {
      return `Insurance:\n\n1. Ekyeya (20k/ekiikka)\n2. Amazzi (25k/ekiikka)\n3. Byonna (40k/ekiikka)\n\nStatus: ${Math.random() > 0.5 ? 'Oli mu program' : 'Tonnayingira'}\n\n0. Ddayo`;
    } else {
      return `Insurance:\n\n1. Ekyanda (20k/acre)\n2. Amatsi (25k/acre)\n3. Byoona (40k/acre)\n\nStatus: ${Math.random() > 0.5 ? 'Orimwo' : 'Toriimwo'}\n\n0. Garuka`;
    }
  }
  
  handleInsurance(session, input) {
    if (input === '0') {
      session.step = 'main_menu';
      return this.showMainMenu(session);
    }
    
    if (session.language === 'en') {
      return `Insurance enrollment initiated!\n\nAn agent will call you to complete registration.\n\n0. Back to Menu`;
    } else {
      return `Insurance registration started!\n\n0. Ddayo`;
    }
  }
  
  showClimateTips(session) {
    const tips = {
      en: [
        'Plant drought-resistant crops like cassava and millet',
        'Use mulching to retain soil moisture',
        'Practice crop rotation to improve soil health',
        'Harvest rainwater for dry season use'
      ],
      lg: [
        'Simba ebirime ebisobola obutaba na mazzi nga muwogo',
        'Kozesa mulch okutereka amazzi mu ttaka',
        'Kyusa ebirime okutumbula ettaka',
        'Tereka amazzi g\'enkuba'
      ],
      rn: [
        'Rimura ebirime ebitakwenda maizi menshi',
        'Kozesa mulch kutereka amaizi',
        'Hindura ebirime kurongyera ettaka',
        'Tereka amaizi g\'enkyura'
      ]
    };
    
    const randomTip = tips[session.language][Math.floor(Math.random() * tips[session.language].length)];
    
    if (session.language === 'en') {
      return `Climate-Smart Tip:\n\n${randomTip}\n\nWeather Forecast (7 days):\nLight rain expected\nTemp: 22-28°C\n\n0. Back to Menu`;
    } else {
      return `Climate Tip:\n\n${randomTip}\n\n0. ${session.language === 'lg' ? 'Ddayo' : 'Garuka'}`;
    }
  }
  
  handleClimateTips(session, input) {
    session.step = 'main_menu';
    return this.showMainMenu(session);
  }
  
  showProfile(session) {
    if (session.language === 'en') {
      return `Your Profile:\n\nPhone: ${session.phoneNumber}\nStatus: Active Farmer\nLand: 2.5 acres\nCrops: Coffee, Maize\nVSLA Member: Yes\n\n1. Update Info\n0. Back to Menu`;
    } else if (session.language === 'lg') {
      return `Profile yo:\n\nSimu: ${session.phoneNumber}\nStatus: Omulimi\nEttaka: 2.5 acres\nEbirime: Mwanyi, Kasooli\nVSLA: Ye\n\n1. Kyusa\n0. Ddayo`;
    } else {
      return `Profile yawe:\n\nSimu: ${session.phoneNumber}\nStatus: Omurimyi\nEttaka: 2.5 acres\nEbirime: Mwani, Ibigori\nVSLA: Ego\n\n1. Hindura\n0. Garuka`;
    }
  }
  
  handleProfile(session, input) {
    if (input === '0') {
      session.step = 'main_menu';
      return this.showMainMenu(session);
    }
    
    if (session.language === 'en') {
      return `Profile update coming soon!\n\nVisit our web portal or contact support.\n\n0. Back to Menu`;
    } else {
      return `Update erijja!\n\n0. ${session.language === 'lg' ? 'Ddayo' : 'Garuka'}`;
    }
  }
  
  handleCreditScoreMenu(session, input) {
    session.step = 'main_menu';
    return this.showMainMenu(session);
  }
  
  getSession(req, res) {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);
    
    if (session) {
      res.json(session);
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
  }
  
  endSession(req, res) {
    const { sessionId } = req.params;
    sessions.delete(sessionId);
    res.json({ message: 'Session ended successfully' });
  }
}

module.exports = new USSDController();
