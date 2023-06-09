// 1. 연구직 , 공학직 질문

const qnaList = [
    {
        q: '1. 업무 중 소음으로 인해 불편했던 경험이 있습니까?',
        a: [
          { answer: 'a. 네, 자주 경험합니다', type: ['위험','경고'] },
          { answer: 'b. 가끔 경험합니다', type: ['경고','주의'] },
          { answer: 'c. 거의 경험하지 않습니다', type: [ '주의','관심' ] },
          { answer: 'd. 아예 경험하지 않습니다', type: ['관심']},
        ]
      },
      {
        q: '2. 업무 중 반복적인 동작이나 자세를 유지하는 경우가 있습니까? ',
        a: [
          { answer: 'a. 네, 매우 자주 있습니다', type: ['위험','경고'] },
          { answer: 'b. 가끔 있습니다', type: ['경고','주의'] },
          { answer: 'c. 거의 없습니다', type: [ '주의','관심' ] },
          { answer: 'd. 아예 없습니다', type: ['관심']},
        ]
      },
      {
        q: '3. 업무 중 위험물질에 접촉하는 경우가 있습니까?',
        a: [
          { answer: 'a. 네, 매우 자주 있습니다', type: ['위험','경고'] },
          { answer: 'b. 가끔 있습니다', type: ['경고','주의'] },
          { answer: 'c. 거의 없습니다', type: [ '주의','관심' ] },
          { answer: 'd. 아예 없습니다', type: ['관심']},
        ]
      },
      {
        q: '4. 업무 중 스트레스나 긴장을 경험하는 경우가 있습니까?',
        a: [
          { answer: 'a. 네, 자주 경험합니다', type: ['위험','경고'] },
          { answer: 'b. 가끔 경험합니다', type: ['경고','주의'] },
          { answer: 'c. 거의 경험하지 않습니다', type: [ '주의','관심' ] },
          { answer: 'd. 아예 경험하지 않습니다', type: ['관심']},
        ]
      },
    {
      q: '5. 긴 시간 동안 컴퓨터를 사용하여 작업하는 경우가 많으십니까?',
      a: [
        { answer: 'a. 네, 자주 그렇습니다', type: ['위험','경고'] },
        { answer: 'b. 가끔 그렇습니다', type: ['경고','주의'] },
        { answer: 'c. 거의 그렇지 않습니다', type: [ '주의','관심' ] },
        { answer: 'd. 전혀 그렇지 않습니다', type: ['관심']},
      ]
    },
    {
      q: '6. 연구나 기술 개발 과정에서 지루한 반복 작업이나 몰입을 요하는 작업으로 인해 심리적인 피로를 경험한 적이 있습니까?',
      a: [
        { answer: 'a. 네, 자주 경험합니다', type: ['위험','경고'] },
        { answer: 'b. 가끔 경험합니다', type: ['경고','주의'] },
        { answer: 'c. 거의 경험하지 않습니다', type: [ '주의','관심' ] },
        { answer: 'd. 아예 경험하지 않습니다', type: ['관심']},
      ]
    },
    {
      q: '7. 긴급한 프로젝트나 과도한 업무로 인해 스트레스를 자주 느끼거나 정신적인 피로를 경험한 적이 있습니까?',
      a: [
        { answer: 'a. 네, 자주 경험합니다', type: ['위험','경고'] },
        { answer: 'b. 가끔 경험합니다', type: ['경고','주의'] },
        { answer: 'c. 거의 경험하지 않습니다', type: [ '주의','관심' ] },
        { answer: 'd. 아예 경험하지 않습니다', type: ['관심']},
      ]
    },
    {
      q: '8. 고용량의 기계 또는 장비 작업으로 인해 진동에 노출되었던 적이 있습니까?',
      a: [
        { answer: 'a. 네, 자주 경험합니다', type: ['위험','경고'] },
        { answer: 'b. 가끔 경험합니다', type: ['경고','주의'] },
        { answer: 'c. 거의 경험하지 않습니다', type: [ '주의','관심' ] },
        { answer: 'd. 아예 경험하지 않습니다', type: ['관심']},
      ]
    }
  ]
    
    
  // 1. 연구직, 공학직 결과 리스트

  const infoList = [
    {
      name: '직업병 <위험> 단계',
      desc: '당신은 직업병 위험 단계입니다. 화학물질 반응에 의한 피부 질환, 반복적인 동작으로 인한 근골격계 질환, 기계 작동 소음이나 진동으로 인한 난청, 긴 노동시간등으로 인한 정신 질환 등으로 인해 고통 받고 있으시군요! 빠른 시일 내에 가까운 병원에서 검진해 보시길 바랍니다. 평소에 충분한 휴식시간을 가지고 정기적인 병원 검진을 통해 건강을 지키세요'
    },
    {
      name: '직업병 <경고> 단계',
      desc: '당신은 직업병 경고 단계입니다. 화학물질 반응에 의한 피부 질환, 반복적인 동작으로 인한 근골격계 질환, 기계 작동 소음이나 진동으로 인한 난청, 긴 노동시간등으로 인한 정신 질환 등이 의심스럽군요! 몸에 불편한 증상이 나타나면 가까운 병원에서 검진해 보시길 바랍니다. 평소에 충분한 휴식시간을 가지고 정기적인 병원 검진을 통해 건강을 지키세요'
    },
    {
      name: '직업병 <주의> 단계',
      desc: '당신은 직업병 주의 단계입니다. 화학물질 반응에 의한 피부 질환, 반복적인 동작으로 인한 근골격계 질환, 기계 작동 소음이나 진동으로 인한 난청, 긴 노동시간등으로 인한 정신 질환 등이 발생할 수 있습니다. 평소에 충분한 휴식시간을 가지고 정기적인 병원 검진을 통해 건강을 지키세요'
    },
    {
      name: '직업병 <관심> 단계',
      desc: '당신은 직업병 관심 단계입니다. 아직 건강하시군요! 하지만 조심하지 않으면 화학물질 반응에 의한 피부 질환, 반복적인 동작으로 인한 근골격계 질환, 기계 작동 소음이나 진동으로 인한 난청, 긴 노동시간 등으로 인한 정신질환 등을 얻을 수 있습니다! 평소에 충분한 휴식시간을 가지고 정기적인 병원 검진을 통해 건강을 지키세요. 앞으로 건강에 관심을 가지고 위험 단계에 가지 않게 조심하세요'
    },
  ]