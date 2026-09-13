document.addEventListener('DOMContentLoaded', () => {
    updateCurrentDate();
    loadTutors();
    handleTutorRegistration();
});

function updateCurrentDate() {
    const dateElement = document.getElementById("current-date");
    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = new Date().toLocaleDateString('ar-DZ', options);
    }
}

async function loadTutors() {
    const container = document.getElementById('tutors-container');
    
    try {
        const { data: tutors, error } = await window.supabaseClient
            .from('tutors')
            .select('*');

        if (error) throw error;

        if (!tutors || tutors.length === 0) {
            container.innerHTML = `
                <div class="empty-notice" style="grid-column: 1 / -1; text-align: center; padding: 30px; background: white; border-radius: 8px;">
                    <p style="color: #666; font-size: 1.1rem;">قائمة الأساتذة قيد التحديث. ترقبوا انطلاق المنصة قريباً!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        tutors.forEach(tutor => {
            const card = document.createElement('div');
            card.className = 'tutor-card';
            
            const messengerLink = tutor.messenger_link || "https://m.me/ouargla.english.oasis";

            card.innerHTML = `
                <div>
                    <h3 style="color: #1b4332; font-family: 'Amiri', serif; font-size: 1.4rem; margin-bottom: 8px;">${tutor.name}</h3>
                    <p style="color: #4a5568; font-size: 0.95rem; margin-bottom: 12px;">${tutor.bio || 'أستاذ متخصص في اللغة الإنجليزية.'}</p>
                    <div style="font-size: 0.85rem; color: #718096; border-top: 1px solid #edf2f7; padding-top: 10px; margin-top: 10px; margin-bottom: 15px;">
                        <span>المستوى: ${tutor.school_level || 'جميع الأطوار'}</span> | 
                        <span>الدعم: ${tutor.location_type || 'مكاني / أونلاين'}</span>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <a href="${messengerLink}" target="_blank" style="background-color: #0084ff; color: white; text-decoration: none; padding: 10px; border-radius: 6px; text-align: center; font-weight: bold; font-size: 0.9rem;">
                        💬 تواصل عبر الماسنجر
                    </a>
                    <button onclick="openRatingModal('${tutor.name}')" style="background-color: transparent; color: #1b4332; border: 1px solid #1b4332; padding: 8px; border-radius: 6px; font-weight: bold; font-size: 0.85rem; cursor: pointer;">
                        ⭐ شاركنا تقييم تجربتك مع الأستاذ
                    </button>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (err) {
        console.error('خطأ في جلب بيانات الأساتذة:', err);
        container.innerHTML = `<p class="loading-text" style="color: #e53e3e; text-align: center;">عذراً، حدث خطأ في الاتصال بقاعدة البيانات.</p>`;
    }
}

function handleTutorRegistration() {
    const registerForm = document.getElementById("tutor-register-form");
    
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const msgElement = document.getElementById("form-message");
            
            const name = document.getElementById("tutor-name").value.trim();
            const service_type = document.getElementById("service-type").value;
            const school_level = document.getElementById("school-level").value;
            const location_type = document.getElementById("location-type").value;
            const messenger_link = document.getElementById("messenger-link").value.trim();
            const bio = document.getElementById("tutor-bio").value.trim();

            msgElement.textContent = "جاري إرسال طلبك وتسجيلك...";
            msgElement.style.color = "#d4af37";

            try {
                const { data, error } = await window.supabaseClient
                    .from('tutors')
                    .insert([{ name, service_type, school_level, location_type, messenger_link, bio }]);

                if (error) throw error;

                msgElement.textContent = "تم تسجيلك بنجاح! ستظهر بطاقتك في الدليل فوراً.";
                msgElement.style.color = "#2b8a3e";
                registerForm.reset();
                loadTutors();

            } catch (err) {
                console.error("Error inserting tutor:", err);
                msgElement.textContent = "عذراً، حدث خطأ أثناء التسجيل. يرجى التحقق من المدخلات.";
                msgElement.style.color = "#c92a2a";
            }
        });
    }
}

function openRatingModal(tutorName) {
    const modal = document.getElementById("rating-modal");
    const desc = document.getElementById("modal-desc");
    desc.textContent = `يسعدنا جداً سماع رأيك حول حصص الدعم وتجربتك مع الأستاذ (${tutorName}). انقر أدناه للانتقال إلى صفحة الفيسبوك ومشاركة تقييمك في التعليقات.`;
    modal.style.display = "flex";
}

function closeRatingModal() {
    document.getElementById("rating-modal").style.display = "none";
}

function goToFacebookRating() {
    window.open("https://www.facebook.com/ouargla.english.oasis/", "_blank");
    closeRatingModal();
}
