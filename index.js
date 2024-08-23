const axios = require('axios');
const xlsx = require('xlsx');
const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();


exports.handler = async function (event, context, callback) {
    try {
        // API için gerekli parametreler ve URL'ler
        const token = 'MIIOWQYJKoZIhvcNAQcCoIIOSjCCDkYCAQExDTALBglghkgBZQMEAgEwggxrBgkqhkiG9w0BBwGgggxcBIIMWHsidG9rZW4iOnsiZXhwaXJlc19hdCI6IjIwMjQtMDgtMjNUMTE6NTQ6MTguMjE3MDAwWiIsIm1ldGhvZHMiOlsicGFzc3dvcmQiXSwiY2F0YWxvZyI6W10sInJvbGVzIjpbeyJuYW1lIjoidGVfYWRtaW4iLCJpZCI6IjAifSx7Im5hbWUiOiJ0ZV9hZ2VuY3kiLCJpZCI6IjAifSx7Im5hbWUiOiJvcF9nYXRlZF9jc2JzX3JlcF9hY2NlbGVyYXRpb24iLCJpZCI6IjAifSx7Im5hbWUiOiJvcF9nYXRlZF9lY3NfZGlza0FjYyIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX2Rzc19tb250aCIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX29ic19kZWVwX2FyY2hpdmUiLCJpZCI6IjAifSx7Im5hbWUiOiJvcF9nYXRlZF9hX2NuLXNvdXRoLTRjIiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfZGVjX21vbnRoX3VzZXIiLCJpZCI6IjAifSx7Im5hbWUiOiJvcF9nYXRlZF9jYnJfc2VsbG91dCIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX2Vjc19vbGRfcmVvdXJjZSIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX3Bhbmd1IiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfd2VsaW5rYnJpZGdlX2VuZHBvaW50X2J1eSIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX2Nicl9maWxlIiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfZG1zLXJvY2tldG1xNS1iYXNpYyIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX2Rtcy1rYWZrYTMiLCJpZCI6IjAifSx7Im5hbWUiOiJvcF9nYXRlZF9lZGdlc2VjX29idCIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX29ic19kZWNfbW9udGgiLCJpZCI6IjAifSx7Im5hbWUiOiJvcF9nYXRlZF9jc2JzX3Jlc3RvcmUiLCJpZCI6IjAifSx7Im5hbWUiOiJvcF9iY3BfcHJvamVjdCIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX2lkbWVfbWJtX2ZvdW5kYXRpb24iLCJpZCI6IjAifSx7Im5hbWUiOiJvcF9nYXRlZF9lY3NfYzZhIiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZmluZV9ncmFpbmVkIiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfbXVsdGlfYmluZCIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX3Ntbl9jYWxsbm90aWZ5IiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfYV9hcC1zb3V0aGVhc3QtM2QiLCJpZCI6IjAifSx7Im5hbWUiOiJvcF9nYXRlZF9jc2JzX3Byb2dyZXNzYmFyIiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfY2VzX3Jlc291cmNlZ3JvdXBfdGFnIiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfZWNzX29mZmxpbmVfYWM3IiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfZXZzX3JldHlwZSIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2ludGVybmFsIiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfa29vbWFwIiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfZXZzX2Vzc2QyIiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfZG1zLWFtcXAtYmFzaWMiLCJpZCI6IjAifSx7Im5hbWUiOiJvcF9nYXRlZF9ldnNfcG9vbF9jYSIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX2FfY24tc291dGh3ZXN0LTJiIiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfaHdjcGgiLCJpZCI6IjAifSx7Im5hbWUiOiJvcF9nYXRlZF9lY3Nfb2ZmbGluZV9kaXNrXzQiLCJpZCI6IjAifSx7Im5hbWUiOiJvcF9nYXRlZF9od2RldiIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX29wX2dhdGVkX2NiaF92b2x1bWUiLCJpZCI6IjAifSx7Im5hbWUiOiJvcF9nYXRlZF9zbW5fd2VsaW5rcmVkIiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfaHZfdmVuZG9yIiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfYV9jbi1ub3J0aC00ZSIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX2FfY24tbm9ydGgtNGQiLCJpZCI6IjAifSx7Im5hbWUiOiJvcF9nYXRlZF9lY3NfaGVjc194IiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfZWNzX2FjNyIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX2NzYnNfcmVzdG9yZV9hbGwiLCJpZCI6IjAifSx7Im5hbWUiOiJvcF9nYXRlZF9hX2NuLW5vcnRoLTRmIiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfb2N0b3B1cyIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX29wX2dhdGVkX3JvdW5kdGFibGUiLCJpZCI6IjAifSx7Im5hbWUiOiJvcF9nYXRlZF9ldnNfZXh0IiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfcGZzX2RlZXBfYXJjaGl2ZSIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX2FfYXAtc291dGhlYXN0LTFlIiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfYV9ydS1tb3Njb3ctMWIiLCJpZCI6IjAifSx7Im5hbWUiOiJvcF9nYXRlZF9hX2FwLXNvdXRoZWFzdC0xZCIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX2FwcHN0YWdlIiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfYV9hcC1zb3V0aGVhc3QtMWYiLCJpZCI6IjAifSx7Im5hbWUiOiJvcF9nYXRlZF9zbW5fYXBwbGljYXRpb24iLCJpZCI6IjAifSx7Im5hbWUiOiJvcF9nYXRlZF9ldnNfY29sZCIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX3Jkc19jYSIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX2Vjc19ncHVfZzVyIiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfb3BfZ2F0ZWRfbWVzc2FnZW92ZXI1ZyIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX2Vjc19yaSIsImlkIjoiMCJ9LHsibmFtZSI6Im9wX2dhdGVkX2FfcnUtbm9ydGh3ZXN0LTJjIiwiaWQiOiIwIn0seyJuYW1lIjoib3BfZ2F0ZWRfaWVmX3BsYXRpbnVtIiwiaWQiOiIwIn1dLCJwcm9qZWN0Ijp7ImRvbWFpbiI6eyJuYW1lIjoiaHdzdGFmZl9odHJkY19NU0RDIiwiaWQiOiJjYzA2NjM2OTIxMTI0MDZjOWZmNjNmNTIxZDg1MWNmOCJ9LCJuYW1lIjoiYXAtc291dGhlYXN0LTMiLCJpZCI6ImNlNTI4MGQ2MGRlMjRkNmNhOTExNjIyOWYyNjQ2ZTE3In0sImlzc3VlZF9hdCI6IjIwMjQtMDgtMjJUMTE6NTQ6MTguMjE3MDAwWiIsInVzZXIiOnsiZG9tYWluIjp7Im5hbWUiOiJod3N0YWZmX2h0cmRjX01TREMiLCJpZCI6ImNjMDY2MzY5MjExMjQwNmM5ZmY2M2Y1MjFkODUxY2Y4In0sIm5hbWUiOiJiMDA4OTUxNDMiLCJwYXNzd29yZF9leHBpcmVzX2F0IjoiIiwiaWQiOiI4MTg0MDc5MWVmMDM0ZTc0OGUzOWQyYTM3ZGM5MTgxYyJ9fX0xggHBMIIBvQIBATCBlzCBiTELMAkGA1UEBhMCQ04xEjAQBgNVBAgMCUd1YW5nRG9uZzERMA8GA1UEBwwIU2hlblpoZW4xLjAsBgNVBAoMJUh1YXdlaSBTb2Z0d2FyZSBUZWNobm9sb2dpZXMgQ28uLCBMdGQxDjAMBgNVBAsMBUNsb3VkMRMwEQYDVQQDDApjYS5pYW0ucGtpAgkA3LMrXRBhahAwCwYJYIZIAWUDBAIBMA0GCSqGSIb3DQEBAQUABIIBACWDmiv-ca09AgQPMIR2fhMYJGWGyf6pA3086T4FBeSkNtQITYyGVadyB3x5X2QyigpxH04D10+qZ2cCI6G2jEzr0ykJlWBfBn3rFBjUeHFrkL4SfMZg8pi4g81j-cCDYY9QbVxTXpCiNjdFjYcNdJwxdQyznIEKAvgfXOkaeG3fRQKOxZ70cP-tuAf-zsgSVrMcqtu5ig4vCOfmDKrD1S4ZMJGjCg551IVZF6NHJwjnsHTmSvs95wdZlxkTF7ykR1KA3Z4hmz9ob-XjGFsiksVFGl9-3tCDbAyt6jS0ZL1u6USGGTTQmX5QJAcpm5Cx7PjPkBsvAIWxaB41RkvGeJI='  // FunctionGraph ortam değişkeni olarak saklanabilir
        const region = 'ap-southeast-3';  // Örneğin: 'eu-west-0'
        const project_id = 'ce5280d60de24d6ca9116229f2646e17';  // Proje kimliğinizi buraya ekleyin
        const apiUrl = `https://cbr.${region}.myhuaweicloud.com/v3/${project_id}/operation-logs`;

        // Tarihleri hesaplama: Bir önceki gün 06:00 ve aynı gün 00:00
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const start_time = new Date(yesterday.setHours(6, 0, 0, 0)).toISOString().replace('.000Z', 'Z'); // Bir önceki gün 06:00
        const end_time = new Date(today.setHours(0, 0, 0, 0)).toISOString().replace('.000Z', 'Z'); // Aynı gün 00:00

        // API'ye istek yap
        const response = await axios.get(apiUrl, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': token
            },
            params: {
                'start_time': start_time,
                'end_time': end_time,
            }
        });

        // İstenen parametreleri toplayın
        const logs = response.data.operation_logs.map(log => ({
            TaskID: log.extra_info?.common?.task_id || log.id,
            BackupID: log.extra_info?.backup?.backup_id,
            TaskType: log.operation_type,
            Status: log.status,
            ResourceID: log.extra_info?.resource?.id,
            ResourceName: log.extra_info?.resource?.name,
            ResourceType: log.extra_info?.resource?.type,
            VaultID: log.vault_id,
            VaultName: log.vault_name,
            Started: log.started_at,
            Ended: log.ended_at
        }));

        // Excel dosyası oluşturma
        const worksheet = xlsx.utils.json_to_sheet(logs);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'CBR Logs');

        // Excel dosyasını kaydetme
        const filePath = '/tmp/cbr_logs.xlsx';
        xlsx.writeFile(workbook, filePath);

        console.log('Excel dosyası oluşturuldu:', filePath);
        callback(null, `Excel dosyası oluşturuldu: ${filePath}`);

        // Nodemailer konfigürasyonu
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // SMTP sunucusu adresi
            port: 587, // SMTP portu
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'bdomobil541@gmail.com', // SMTP kullanıcı adı
                pass: process.env.SMTP_PASS  // SMTP şifresi
            }
        });

        // E-posta gönderimi
        const mailOptions = {
            from: '"CBR Reports" <bdomobil541@gmail.com>', // Gönderen
            to: 'iburakbakir@gmail.com', // Alıcı e-posta adresi
            subject: 'Daily CBR Report', // E-posta konusu
            text: 'Lütfen ektede bulunan günlük CBR raporunu inceleyin.', // E-posta metni
            attachments: [
                {
                    filename: 'cbr_logs.xlsx',
                    path: filePath // Excel dosyasını ek olarak ekliyoruz
                }
            ]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('E-posta gönderimi başarısız oldu:', error.message); // Hata mesajını loglayın
                console.error('Error stack:', error.stack); // Daha fazla hata detayı için
                callback(error);
            } else {
                console.log('E-posta başarıyla gönderildi:', info.response);
                console.log('Mail info:', info); // Mail ile ilgili daha fazla bilgi loglayın
                callback(null, 'E-posta başarıyla gönderildi');
            }
        });

    } catch (error) {
        console.error('API isteği başarısız oldu:', error);
        callback(error);
    }
};
