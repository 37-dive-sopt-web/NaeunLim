import { members } from "./members.js";

if(!localStorage.getItem('membersData')) {
    localStorage.setItem('membersData', JSON.stringify(members));
}

let data = JSON.parse(localStorage.getItem('membersData')) || [];

const form = document.querySelector("#filterForm");
const tbody = document.querySelector("#memberTable tbody");
const addBtn = document.getElementById("add");
const deleteBtn = document.getElementById("delete");
const selectAll = document.getElementById("selectAll");

const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const addForm = document.querySelector("#addForm");

// 테이블 불러오기
function renderTable(rows) {
    // 이전에 있던 내용 삭제
    tbody.innerHTML = ""; 

    // 검색 내용이 없을 때
    if(rows.length === 0) {
        tbody.innerHTML = `<tr><td> 검색 결과가 없습니다. </td></tr>`;
        return;
    }

    // 검색된 내용이 있다면 표의 한 줄(tr) 생성
    rows.forEach(function(row) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td><input type="checkbox" class="rowCheck" data-id=${row.id}></td>
            <td>${row.name}</td>
            <td>${row.englishName}</td>
            <td>${row.github}</td>
            <td>${row.gender}</td>
            <td>${row.role}</td>
            <td>${row.codeReviewGroup}</td>
            <td>${row.age}</td>
        
        `;

        tbody.appendChild(tr);
    });
}

// 처음에는 모든 데이터를 다 보여 줌
renderTable(data);

form.addEventListener("submit", function(e) {
    e.preventDefault(); // 새로고침 방지

    const name = document.getElementById('filter-name').value.trim();
    const englishName = document.getElementById('filter-englishName').value.trim();
    const github = document.getElementById('filter-github').value.trim();
    const gender = document.getElementById('filter-gender').value.trim();
    const role = document.getElementById('filter-role').value.trim();
    const codeReviewGroup = document.getElementById('filter-codeReviewGroup').value.trim();
    const age = document.getElementById('filter-age').value.trim();

    // filter 메소드를 통한 필터링
    const filtered = data.filter(function(item) {
        // 각 속성의 일치 여부를 변수로 선언하고 비교
        const matchName = !name || item.name.includes(name);
        const matchEnglishName = !englishName || item.englishName.includes(englishName);
        const matchGithub = !github || item.github.includes(github);
        const matchGender = !gender || item.gender == gender;
        const matchRole = !role || item.role.includes(role);
        const matchCodeReviewGroup = !codeReviewGroup || item.codeReviewGroup == codeReviewGroup;
        const matchAge = !age || item.age == age;
        
        return (matchName && matchEnglishName && matchGithub && matchGender && matchRole && matchCodeReviewGroup && matchAge);
    });

    renderTable(filtered);
})

// 초기화 버튼
form.addEventListener("reset", function(e) {
    renderTable(data); // 다시 전체 데이터 보여주기
})

// 전체 선택
selectAll.addEventListener("change", function() {
    const checkboxes = document.querySelectorAll(".rowCheck");
    for(var i=0; i<checkboxes.length; i++) {
        checkboxes[i].checked = selectAll.checked;
    }
})

// 선택 삭제
deleteBtn.addEventListener("click", function() {
    const checkboxes = document.querySelectorAll(".rowCheck:checked");

    // 체크된 항목의 id만 모아 배열로 
    const idsToDelete = [];
    for(var i=0; i<checkboxes.length; i++) {
        idsToDelete.push(checked[i].dataset.id);
    }

    // 삭제할 id가 포함되지 않은 항목만 남겨 data 새로 생성
    data = data.filter(function(item) {
        return !idsToDelete.includes(String(item.id));
    });

    // 저장하고 다시 렌더링
    localStorage.setItem("membersData", JSON.stringify(data));
    renderTable(data);
})

// 멤버 추가, 모달
addBtn.addEventListener("click", function() {
    modal.classList.remove("hidden");
});

closeModal.addEventListener("click", function() {
    modal.classList.add("hidden");
});

modal.addEventListener("click", function(e) {
    // modal 자체를 눌렀을 때만 닫히도록 (form, 버튼 클릭은 무시)
    if(e.target === modal) {
        modal.classList.add("hidden");
    }
});

addForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const newMember = {
        id: Date.now(),
        name: document.getElementById("add-name").value.trim(),
        englishName: document.getElementById("add-englishName").value.trim(),
        github: document.getElementById("add-github").value.trim(),
        gender: document.getElementById("add-gender").value.trim(),
        role: document.getElementById("add-role").value.trim(),
        codeReviewGroup: document.getElementById("add-codeReviewGroup").value.trim(),
        age: document.getElementById("add-age").value.trim(),
    };

    data.push(newMember);

    localStorage.setItem("membersData", JSON.stringify(data));

    renderTable(data);

    modal.classList.add("hidden");

    addForm.reset();
});