export interface Station {
  id: number;
  title: string;
  activity: string;
  mission: string;
  reward: number;
}

export interface DayMission {
  id: string;
  dayName: string;
  theme: string;
  phase: number;
  stations: Station[];
}

export const stretchingData: DayMission[] = [
  {
    id: '1',
    dayName: 'Thứ 2',
    theme: 'Khởi động cơ bản',
    phase: 1,
    stations: [
      { id: 1, title: 'Trạm 1 (Sáng dậy)', activity: 'Chuông báo thức reo, vừa mở mắt.', mission: 'Vươn vai toàn thân (15s). Co 2 gối về ngực, lắc nhẹ (20s).', reward: 10 },
      { id: 2, title: 'Trạm 2 (Vệ sinh cá nhân)', activity: 'Đang đánh răng.', mission: 'Đứng thẳng, nhón gót (giữ 2s, hạ) x 10-15 lần.', reward: 10 },
      { id: 3, title: 'Trạm 3 (Bắt đầu làm việc)', activity: 'Vừa ngồi vào bàn, chờ máy tính khởi động.', mission: 'Giãn cơ cổ tay (15s/bên). Nhún/Xoay vai (5 lần).', reward: 10 },
      { id: 4, title: 'Trạm 4 (Giải lao/Lấy nước)', activity: 'Đứng dậy đi lấy nước hoặc trong lúc chờ pha cà phê.', mission: 'Đứng nghiêng lườn (10s/bên). Căng cơ ngực (tại khung cửa/tường, 20s).', reward: 10 },
      { id: 5, title: 'Trạm 5 (Tan làm)', activity: 'Chuẩn bị tắt máy tính, đứng lên.', mission: 'Vươn tay cao (đan tay, 10s). Căng cơ tay sau (15s/bên).', reward: 10 },
      { id: 6, title: 'Trạm 6 (Trước khi ngủ)', activity: 'Đã lên giường, chuẩn bị tắt đèn.', mission: 'Nằm vặn cột sống (30s/bên).', reward: 10 },
    ]
  },
  {
    id: '2',
    dayName: 'Thứ 3',
    theme: 'Tập trung Cổ - Vai',
    phase: 1,
    stations: [
      { id: 1, title: 'Trạm 1 (Sáng dậy)', activity: 'Vừa tắt báo thức.', mission: 'Vươn vai. Nằm nghiêng "mở sách" (xoay vai, 5 lần/bên).', reward: 10 },
      { id: 2, title: 'Trạm 2 (Vệ sinh cá nhân)', activity: 'Đang rửa mặt / skincare.', mission: 'Đứng thẳng, căng cơ cổ 3 hướng (trái, phải, gập cằm, 15s/hướng).', reward: 10 },
      { id: 3, title: 'Trạm 3 (Giữa buổi sáng)', activity: 'Cảm thấy hơi mỏi cổ, hoặc vừa xong một cuộc gọi.', mission: 'Căng cơ vai (vắt tay ngang ngực, 15s/bên). Đan tay sau gáy, ưỡn ngực.', reward: 10 },
      { id: 4, title: 'Trạm 4 (Trước/Sau ăn trưa)', activity: 'Vừa ăn xong, ngồi nghỉ.', mission: 'Ngồi thẳng, đan tay sau lưng, đẩy ngực về trước, nâng tay (20s).', reward: 10 },
      { id: 5, title: 'Trạm 5 (Giữa buổi chiều)', activity: 'Vừa họp xong, quay lại bàn.', mission: 'Nhún/Xoay vai (10 lần). Căng cơ tay sau (15s/bên).', reward: 10 },
      { id: 6, title: 'Trạm 6 (Trước khi ngủ)', activity: 'Đã lên giường.', mission: 'Tư thế "Luồn kim" (Thread the Needle) trên giường (30s/bên).', reward: 10 },
    ]
  },
  {
    id: '3',
    dayName: 'Thứ 4',
    theme: 'Giải cứu Lưng - Hông',
    phase: 1,
    stations: [
      { id: 1, title: 'Trạm 1 (Sáng dậy)', activity: 'Vừa tắt báo thức.', mission: 'Tư thế Mèo-Bò (trên nệm, 5-8 nhịp). Ôm 2 gối về ngực.', reward: 10 },
      { id: 2, title: 'Trạm 2 (Vệ sinh cá nhân)', activity: 'Đang đánh răng.', mission: 'Nhón gót. Thêm: Đứng lắc nhẹ hông theo vòng tròn.', reward: 10 },
      { id: 3, title: 'Trạm 3 (Bắt đầu làm việc)', activity: 'Vừa ngồi vào ghế.', mission: 'Vặn mình tại ghế (xoay trái/phải, 20s/bên).', reward: 10 },
      { id: 4, title: 'Trạm 4 (Giải lao/Lấy nước)', activity: 'Đứng chờ lấy nước.', mission: 'Đứng chống tay vào hông, ngả nhẹ lưng ra sau (10s, 2 lần).', reward: 10 },
      { id: 5, title: 'Trạm 5 (Giữa buổi chiều)', activity: 'Cảm thấy mỏi lưng dưới.', mission: 'Ngồi vắt chéo chân (Hình số 4), gập nhẹ người (giãn cơ mông/hông, 20s/bên).', reward: 10 },
      { id: 6, title: 'Trạm 6 (Trước khi ngủ)', activity: 'Đã lên giường.', mission: 'Tư thế Em bé (Child\'s Pose) (60s).', reward: 10 },
    ]
  },
  {
    id: '4',
    dayName: 'Thứ 5',
    theme: 'Giãn cơ chơn (Chân)',
    phase: 1,
    stations: [
      { id: 1, title: 'Trạm 1 (Sáng dậy)', activity: 'Vừa tắt báo thức.', mission: 'Vươn vai. Nằm ngửa, co gối xoay khớp háng (5 vòng/bên).', reward: 10 },
      { id: 2, title: 'Trạm 2 (Vệ sinh cá nhân)', activity: 'Đang đánh răng.', mission: 'Nhón gót (15 lần).', reward: 10 },
      { id: 3, title: 'Trạm 3 (Giữa buổi sáng)', activity: 'Ngồi lâu, thấy chân hơi tê.', mission: 'Ngồi duỗi 1 chân, gót chạm sàn, gập mũi chân về người (căng đùi sau/bắp chân, 20s/bên).', reward: 10 },
      { id: 4, title: 'Trạm 4 (Trước/Sau ăn trưa)', activity: 'Đang đứng chờ thang máy hoặc chờ đồ ăn.', mission: 'Đứng vịn, căng cơ đùi trước (kéo gót về mông, 15s/bên).', reward: 10 },
      { id: 5, title: 'Trạm 5 (Giải lao/Lấy nước)', activity: 'Đang đứng.', mission: 'Căng cơ bắp chân (đứng ép tường, 20s/bên).', reward: 10 },
      { id: 6, title: 'Trạm 6 (Trước khi ngủ)', activity: 'Đã lên giường.', mission: 'Nằm ngửa gác chân Hình số 4 (30s/bên).', reward: 10 },
    ]
  },
  {
    id: '5',
    dayName: 'Thứ 6',
    theme: 'Xả stress toàn thân',
    phase: 1,
    stations: [
      { id: 1, title: 'Trạm 1 (Sáng dậy)', activity: 'Vừa tắt báo thức.', mission: 'Vươn vai (hít thật sâu, thở ra duỗi căng). Ôm gối lăn lưng.', reward: 10 },
      { id: 2, title: 'Trạm 2 (Vệ sinh cá nhân)', activity: 'Đang rửa mặt/skincare.', mission: 'Căng cơ cổ 3 hướng (15s/hướng).', reward: 10 },
      { id: 3, title: 'Trạm 3 (Giữa buổi sáng)', activity: 'Cảm thấy "ngợp" việc.', mission: 'Hít thở hộp (Hít 4s, Giữ 4s, Thở 4s, Giữ 4s) x 5 vòng. Rũ và lắc cổ tay.', reward: 10 },
      { id: 4, title: 'Trạm 4 (Giải lao/Lấy nước)', activity: 'Đứng dậy, vươn vai.', mission: 'Đứng lắc hông, rũ tay chân thả lỏng toàn bộ.', reward: 10 },
      { id: 5, title: 'Trạm 5 (Tan làm)', activity: 'Tắt máy tính.', mission: 'Đứng gập người thả lỏng (Ragdoll pose), đầu gối chùng, lắc nhẹ 2 bên.', reward: 10 },
      { id: 6, title: 'Trạm 6 (Trước khi ngủ)', activity: 'Đã lên giường, chuẩn bị kết thúc tuần làm việc.', mission: 'Nằm thả lỏng (Savasana) 3-5 phút, tập trung vào hơi thở.', reward: 10 },
    ]
  },
  {
    id: '6',
    dayName: 'Thứ 7',
    theme: 'Ngày linh hoạt & dọn dẹp',
    phase: 2,
    stations: [
      { id: 1, title: 'Trạm 1 (Sáng dậy)', activity: 'Ngủ dậy muộn hơn, vừa mở mắt.', mission: 'Vươn vai giữ lâu (20s). Nằm vặn cột sống (30s/bên).', reward: 10 },
      { id: 2, title: 'Trạm 2 (Pha cà phê/Ăn sáng)', activity: 'Đang chờ nước sôi hoặc chờ nướng bánh mì.', mission: 'Đứng xoay các khớp (cổ, vai, hông, gối, cổ chân) - 10 vòng/khớp.', reward: 10 },
      { id: 3, title: 'Trạm 3 (Sau khi dọn dẹp)', activity: 'Vừa hút bụi/lau nhà/làm việc vặt xong.', mission: 'Tư thế Mèo-Bò (10 nhịp). Tư thế Em bé (60s) (để xả mỏi lưng).', reward: 10 },
      { id: 4, title: 'Trạm 4 (Khi xem TV/Giải trí)', activity: 'Đang ngồi xem TV, tới đoạn quảng cáo.', mission: 'Ngồi bươm bướm (30s). Ngồi vắt chéo chân (Hình số 4, 20s/bên).', reward: 10 },
      { id: 5, title: 'Trạm 5 (Trước đi chơi/Đi chợ)', activity: 'Đang chuẩn bị ra ngoài.', mission: 'Đứng căng cơ đùi trước & đùi sau (20s/bên).', reward: 10 },
      { id: 6, title: 'Trạm 6 (Trước khi ngủ)', activity: 'Đã lên giường.', mission: 'Nằm ngửa gác chân Hình số 4 (30s/bên).', reward: 10 },
    ]
  },
  {
    id: '7',
    dayName: 'Chủ Nhật',
    theme: 'Ngày phục hồi sâu',
    phase: 2,
    stations: [
      { id: 1, title: 'Trạm 1 (Sáng dậy)', activity: 'Dậy thảnh thơi.', mission: 'Vươn vai (giữ lâu 30s, hít thở sâu).', reward: 10 },
      { id: 2, title: 'Trạm 2 (Tưới cây/Ra ban công)', activity: 'Đang tưới cây hoặc ra ban công hít thở.', mission: 'Đứng nghiêng lườn (15s/bên). Căng cơ ngực (vịn tay vào tường).', reward: 10 },
      { id: 3, title: 'Trạm 3 (Sau bữa trưa)', activity: 'Vừa ăn trưa xong, ngồi nghỉ ngơi.', mission: 'Ngồi hít thở sâu 2 phút. Căng cơ cổ 3 hướng.', reward: 10 },
      { id: 4, title: 'Trạm 4 (Đọc sách/Lướt web)', activity: 'Đang ngồi thư giãn buổi chiều.', mission: 'Giãn cơ cổ tay. Xoay bả vai (10 lần).', reward: 10 },
      { id: 5, title: 'Trạm 5 (Sau khi tắm)', activity: 'Vừa tắm xong, cơ thể đang ấm.', mission: 'Ngồi gập người duỗi chân (căng đùi sau, 30s). Nằm vặn cột sống (30s/bên).', reward: 10 },
      { id: 6, title: 'Trạm 6 (Chuẩn bị tuần mới)', activity: 'Đã lên giường, chuẩn bị ngủ.', mission: 'Nằm ngửa gác 2 chân thẳng lên tường (5-10 phút). Sau đó nằm thả lỏng (Savasana) 3 phút.', reward: 10 },
    ]
  }
];
