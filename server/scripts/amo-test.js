import { amo } from '../src/services/amo.js';

async function main() {
  console.log('1. Проверка токена (GET /account)...');
  const account = await amo.getAccount();
  console.log(`   ✅ Аккаунт: ${account.name} (id=${account.id}, поддомен=${account.subdomain})`);

  console.log('\n2. Список воронок и этапов:');
  const { _embedded } = await amo.listPipelines();
  for (const p of _embedded.pipelines) {
    console.log(`\n   📋 ${p.name}  (pipeline_id=${p.id}${p.is_main ? ', основная' : ''})`);
    for (const s of p._embedded.statuses) {
      console.log(`      └─ [${s.id}] ${s.name}  (sort=${s.sort})`);
    }
  }

  console.log('\n3. Текущие кастомные поля сделок (для понимания, что уже есть):');
  const fields = await amo.listLeadCustomFields();
  const list = fields._embedded?.custom_fields || [];
  if (list.length === 0) {
    console.log('   (полей нет)');
  } else {
    for (const f of list) {
      console.log(`   • [${f.id}] ${f.name}  (type=${f.type}, code=${f.code || '—'})`);
    }
  }
}

main().catch((e) => {
  console.error('❌ Ошибка:', e.message);
  if (e.body) console.error('   ответ:', JSON.stringify(e.body, null, 2));
  process.exit(1);
});
