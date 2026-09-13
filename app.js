// التهيئة والربط مع Supabase من ملف config.js
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// جلب وعرض الأساتذة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    fetchTutors();
});

async function fetchTutors() {
    const tutorsListContainer = document.getElementById('tutors-list');
    tutorsListContainer.innerHTML = '<p style="text-align: center;">جاري تحميل قائمة الأساتذة...</p>';

    const { data: tutors, error } = await supabaseClient
        .from('tutors')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error('خطأ في جلب الأساتذة:', error);
        tutorsListContainer.innerHTML = '<p style="text-align: center; color: red;">عذراً، حدث خطأ أثناء تحميل البيانات.</p>';
        return;
    }

    if (!tutors || tutors.length === 0) {
        tutorsListContainer.innerHTML = '<p style="text-align: center; color: #718096;">لا يوجد أساتذة مسجلون حالياً. كن أول من يسجل!</p>';
        return;
    }

    tutorsListContainer.innerHTML = '';
    tutors.forEach(tutor => {
        const neighborhoodText = tutor.neighborhood ? ` - حي: ${tutor.neighborhood}` : '';
        
        const tutorCard = document.createElement('div');
        tutorCard.className = 'tutor-card';
        tutorCard.innerHTML = `
            <div class="tutor-info">
                <h3>${tutor.name}</h3>
                <p><strong>التخصص:</strong> ${tutor.subject}</p>
                <p><strong>الطور:</strong> ${tutor.stage}</p>
                <p><strong>المنطقة:</strong> ${tutor.municipality} ${neighborhoodText}</p>
                <p><strong>للتواصل:</strong> ${tutor.contact}</p>
            </div>
            <div class="tutor-review-box">
                <p style="font-size: 12px; margin: 0 0 8px 0; color: #276749;">رأيك يهمنا</p>
                <button onclick="rateTeacher('${tutor.name.replace(/'/g, "\\'")}')" class="rate-btn">⭐ تقييم التجربة</button>
            </div>
        `;
        tutorsListContainer.appendChild(tutorsCard);
    });
}

// دالة تسجيل أستاذ جديد
async function registerTutor(event) {
    event.preventDefault();

    const tutorData = {
        name: document.getElementById('tutor-name').value.trim(),
        subject: document.getElementById('tutor-subject').value,
        stage: document.getElementById('tutor-stage').value.trim(),
        municipality: document.getElementById('tutor-municipality').value,
        neighborhood: document.getElementById('tutor-neighborhood').value.trim(),
        contact: document.getElementById('tutor-contact').value.trim()
    };

    const { error } = await supabaseClient
        .from('tutors')
        .insert([tutorData]);

    if (error) {
        alert('حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى.');
        console.error(error);
    } else {
        alert('تم تسجيل الأستاذ بنجاح في الواحة للإنجليزية! 🌴');
        document.getElementById('tutor-form').reset();
        fetchTutors();
    }
}

// دالة تقييم الأستاذ ونسخ اسمه والتوجه للفيسبوك
function rateTeacher(teacherName) {
    const message = `تم نسخ اسم الأستاذ (${teacherName}) بنجاح.\n\nاضغط على موافق للانتقال إلى صفحة الفيسبوك الرسمية لترك تقييمك ولصق الاسم هناك.`;
    
    if (window.confirm(message)) {
        navigator.clipboard.writeText(teacherName).catch(err => {
            console.log('فشل النسخ التلقائي', err);
        });
        // رابط الصفحة الرسمية
        window.open('https://www.facebook.com', '_blank');
    }
}
